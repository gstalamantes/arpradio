import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const DB_NAME = process.env.DB;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedPlaylist = searchParams.get('playlist');
  const stakeAddress = searchParams.get('stakeAddress');

  if (!selectedPlaylist) {
    return NextResponse.json({ error: 'Playlist parameter is required' }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    let query = '';
    let queryParams: any[] = [];

    switch (selectedPlaylist) {
      case 'top50':
        query = `
          SELECT * FROM ${DB_NAME}.current_songs WHERE artist IS NOT NULL
          ORDER BY chart DESC LIMIT 50
        `;
        break;
      case 'latest':
        query = `
          SELECT * FROM ${DB_NAME}.current_songs
          WHERE artist IS NOT NULL
          ORDER BY song_id DESC LIMIT 25
        `;
        break;
      case 'all':
        query = `
          SELECT * FROM ${DB_NAME}.current_songs WHERE artist is not null
          ORDER BY chart DESC
        `;
        break;
      case 'sickcity':
        query = `
          SELECT * FROM ${DB_NAME}.current_songs
          WHERE album LIKE '%Sick City%' and artist is not null
          ORDER BY album
        `;
        break;
      case 'like':
        if (!stakeAddress) {
          return NextResponse.json({ error: 'Stake address is required for likes playlist' }, { status: 400 });
        }
        query = `
          SELECT cs.* FROM ${DB_NAME}.current_songs cs
          INNER JOIN ${DB_NAME}.likes l ON cs.song_id = l.song_id
          WHERE l.stake_address = ?
          ORDER BY cs.chart DESC
        `;
        queryParams = [stakeAddress];
        break;
      default:
        query = `
          SELECT * FROM ${DB_NAME}.current_songs
          WHERE artist IS NOT NULL AND (genre LIKE ? OR sub_genre LIKE ?)
          ORDER BY chart DESC
        `;
        queryParams = [`%${selectedPlaylist}%`, `%${selectedPlaylist}%`];
        break;
    }
    const [results] = await connection.execute(query, queryParams);
    await connection.end();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}