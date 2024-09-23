"use server";

import mysql from 'mysql2/promise';
import { revalidatePath } from 'next/cache';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
};
const db =  process.env.DB
export async function like(id: string, stake: string) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const checkQuery = `SELECT * FROM ${db}.likes WHERE song_id = ? AND stake_address = ?`;
    const [rows] = await connection.execute(checkQuery, [id, stake]);

    let action;
    if ((rows as any[]).length > 0) {
      const deleteQuery = `DELETE FROM ${db}.likes WHERE song_id = ? AND stake_address = ?`;
      await connection.execute(deleteQuery, [id, stake]);
      action = 'unliked';
    } else {
      const insertQuery = `INSERT INTO ${db}.likes (song_id, stake_address) VALUES (?, ?)`;
      await connection.execute(insertQuery, [id, stake]);
      action = 'liked';
    }

    revalidatePath('/radio');

    return { success: true, action };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Internal Server Error' };
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchLikes(stake: string) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT song_id FROM ${db}.likes WHERE stake_address = ?`;
    const [rows] = await connection.execute(query, [stake]);

    return { success: true, likes: (rows as any[]).map(row => row.song_id) };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Internal Server Error' };
  } finally {
    if (connection) await connection.end();
  }
}