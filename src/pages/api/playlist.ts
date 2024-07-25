import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const pool = mysql.createPool(dbConfig);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  try {

    const selectedPlaylist = req.query.playlist as string;
    
    let query = '';
    if (selectedPlaylist === 'top50') {
      query = `
        SELECT id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes
        FROM \`Current Songs\` WHERE artist IS NOT NULL
        ORDER BY chart DESC LIMIT 50
      `;
    } else if (selectedPlaylist === 'latest') {
      query = `
        SELECT id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes
        FROM \`Current Songs\`
        WHERE artist IS NOT NULL
        ORDER BY id DESC LIMIT 25
      `;
    } else if (selectedPlaylist === 'all') {
        query = `
        SELECT id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes FROM \`Current Songs\` WHERE artist is not null
    ORDER BY chart DESC
        `;
      } else if (selectedPlaylist === 'sickcity') {
        query = `
        SELECT id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes FROM \`Current Songs\`
        WHERE album LIKE '%Sick City%' and artist is not null
        ORDER BY album
        `;
      } 
      else if (selectedPlaylist === 'feature') {
        query = `
        SELECT id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes FROM \`Current Songs\`
        WHERE artist = "Refraktal" 
        ORDER BY album
        `;
      } 
      
    else {
      query = `
        SELECT id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes
        FROM \`Current Songs\`
        WHERE artist is not null and genre LIKE '%${selectedPlaylist}%' OR sub_genre LIKE '%${selectedPlaylist}%' 
        ORDER BY chart DESC
      `;
    }

    const results = await executeQuery(query);

    res.status(200).json(results);
  } catch (error) {

    console.error('Error:', error);
    res.status(500).end();
  }
}

function executeQuery(query: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
   
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      connection.query(query, (error, results: any) => {
        connection.release(); 

        if (error) {
          reject(error);
        } else {
          if (Array.isArray(results)) {
            resolve(results);
          } else {
            resolve([]);
          }
        }
      });
    });
  });
}
