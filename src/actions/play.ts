"use server";

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
};
const db = process.env.DB;

export async function recordPlay(songId: string) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const insertQuery = `INSERT INTO ${db}.plays (song_id, played_at) VALUES (?, CURRENT_TIMESTAMP)`;
    const [result] = await connection.execute(insertQuery, [songId]);
 
    return { success: true, action: 'played' };
  } catch (error) {
    console.error('Error in recordPlay:', error);
    return { success: false, error: 'Internal Server Error' };
  } finally {
    if (connection) {

      await connection.end();
    }
  }
}

export async function fetchPlayCount(songId: string) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT COUNT(*) as play_count FROM ${db}.plays WHERE song_id = ?`;
    const [rows] = await connection.execute(query, [songId]);

    return { success: true, playCount: (rows as any[])[0].play_count };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Internal Server Error' };
  } finally {
    if (connection) await connection.end();
  }
}