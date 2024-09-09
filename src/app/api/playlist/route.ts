// File: /src/app/api/playlist/route.ts

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedPlaylist = searchParams.get('playlist');

  if (!selectedPlaylist) {
    return NextResponse.json({ error: 'Playlist parameter is required' }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    let query = '';
    switch (selectedPlaylist) {
      case 'top50':
        query = `
          SELECT song_id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes
          FROM arpradio.current_songs WHERE artist IS NOT NULL
          ORDER BY chart DESC LIMIT 50
        `;
        break;
      case 'latest':
        query = `
          SELECT song_id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes
          FROM arpradio.current_songs
          WHERE artist IS NOT NULL
          ORDER BY song_id DESC LIMIT 25
        `;
        break;
      case 'all':
        query = `
          SELECT song_id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes 
          FROM arpradio.current_songs WHERE artist is not null
          ORDER BY chart DESC
        `;
        break;
      case 'sickcity':
        query = `
          SELECT song_id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes 
          FROM arpradio.current_songs
          WHERE album LIKE '%Sick City%' and artist is not null
          ORDER BY album
        `;
        break;
      default:
        query = `
          SELECT song_id, name, artist, album, url, cover_art_url, link, twitter, bandcamp, soundcloud, apple, audius, newm, spotify, mint, Holders, votes
          FROM arpradio.current_songs
          WHERE artist is not null and (genre LIKE ? OR sub_genre LIKE ?)
          ORDER BY chart DESC
        `;
        break;
    }

    const [results] = await connection.execute(query, selectedPlaylist !== 'top50' && selectedPlaylist !== 'latest' && selectedPlaylist !== 'all' && selectedPlaylist !== 'sickcity' ? [`%${selectedPlaylist}%`, `%${selectedPlaylist}%`] : []);
    await connection.end();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}