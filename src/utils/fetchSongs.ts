
"use server"
import mysql from 'mysql2/promise';

export interface SongEntry {
  song_id: number;
  name: string;
  artist: string;
  album: string;
  genre: string;
  sub_genre: string;
  policyid: string;
  asset_name: string;
}

export interface Cip60Entry {
  token_id: number;
  name: string;
  policyid: string;
  assetname: string;
  metadata: string;
  slotno: number;
}

export type ResultEntry = SongEntry | Cip60Entry;

export async function fetchSongs(searchTerm: string = '', genre: string = '', arpOnly: boolean = false): Promise<ResultEntry[]> {

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
  };

  const db = process.env.DB

  try {
    const connection = await mysql.createConnection(dbConfig);
    let query: string;
    let params: any[] = [];

    if (arpOnly) {
      query = `SELECT * FROM ${db}.current_songs WHERE artist is not null`;
      
      const whereConditions = [];

      if (searchTerm) {
        whereConditions.push('artist LIKE ?');
        params.push(`%${searchTerm}%`);
      }

      if (genre) {
        whereConditions.push('(genre LIKE ? OR sub_genre LIKE ?)');
        params.push(`%${genre}%`, `%${genre}%`);
      }

      if (whereConditions.length > 0) {
        query += ` AND ${whereConditions.join(' AND ')}`;
      }

      query += ' ORDER BY artist';
    } else {
      query = `SELECT * FROM ${db}.cip60`;

      if (searchTerm) {
        query += ' WHERE metadata LIKE ? or name LIKE ?';
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      query += ' ORDER BY name';
    }

    const [results] = await connection.execute(query, params);
    await connection.end();
    return results as ResultEntry[];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}