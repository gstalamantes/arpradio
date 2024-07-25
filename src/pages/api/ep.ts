import axios from 'axios';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

interface OnchainMetadata {
    release?: {
        release_title?: string;
        links?: {
            twitter?: string;
            soundcloud?: string;
            spotify?: string[];
            website?: string;
            bandcamp?: string;
            soundxyz?: string;
            youtube?: string;
            audius?: string;
            apple?: string;
            newm?: string;
        };
        genres?: string[];
        sub_genre?: string;
        artists?: string[];
    };
    image?: string;
    files?: { src?: string }[];
}

interface FilteredData {
    name: string | null;
    twitter: string | null;
    soundcloud: string | null;
    spotify: string | null;
    link: string | null;
    genre: string | null;
    sub_genre: string | null;
    artist: string | null;
    cover_art_url: string | null;
    url: string | null;
    bandcamp: string | null;
    audius: string | null;
    newm: string | null;
    soundxyz: string | null;
    youtube: string | null;
}

async function fetchData(): Promise<FilteredData> {
    try {
        const epochUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest?epoch';
        const baseUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/assets/';

        const currentEpochResponse = await axios.get(epochUrl, {
            headers: { 'project_id': process.env.BLOCKFROST_PROJECT_ID }
        });

        const currentEpoch = currentEpochResponse.data.epoch;
        const nft = "SickCity" + currentEpoch;
        const asset_name = addSpaces(nft).trim();
        const asset = Buffer.from(nft, 'utf-8').toString('hex');
        const assetName = '123da5e4ef337161779c6729d2acd765f7a33a833b2a21a063ef65a5' + asset;
        const assetUrl = baseUrl + assetName;

        const assetResponse = await axios.get(assetUrl, {
            headers: { 'project_id': process.env.BLOCKFROST_PROJECT_ID }
        });

        const onchainMetadata: OnchainMetadata = assetResponse.data.onchain_metadata || {};
        
        const spotifyURL = onchainMetadata.release?.links?.spotify ? onchainMetadata.release.links.spotify.join('') : null;

        const filteredData: FilteredData = {
            name: onchainMetadata.release?.release_title || null,
            twitter: onchainMetadata.release?.links?.twitter || null,
            soundcloud: onchainMetadata.release?.links?.soundcloud || null,
            soundxyz: onchainMetadata.release?.links?.soundxyz || null,
            youtube: onchainMetadata.release?.links?.youtube || null,
            spotify: spotifyURL,
            audius: onchainMetadata.release?.links?.audius || null,
            newm: onchainMetadata.release?.links?.newm || null,
            bandcamp: onchainMetadata.release?.links?.bandcamp || null,
            link: onchainMetadata.release?.links?.website || null,
            genre: onchainMetadata.release?.genres?.[0] || null,
            sub_genre: onchainMetadata.release?.genres?.[1] || onchainMetadata.release?.sub_genre || null,
            artist: onchainMetadata.release?.artists?.[0] || null,
            cover_art_url: onchainMetadata.image?.startsWith('ipfs://') ? 'https://ipfs.io/ipfs/' + onchainMetadata.image.slice(7) : onchainMetadata.image || null,
            url: onchainMetadata.files?.[0]?.src?.startsWith('ipfs://') ? 'https://ipfs.io/ipfs/' + onchainMetadata.files[0].src.slice(7) : onchainMetadata.files?.[0]?.src || null,
        };

        return filteredData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data from API');
    }
}

async function insertDataIntoMySQL(data: FilteredData, asset_name: string): Promise<void> {
    try {
        const connection = await getConnectionFromPool(pool);

        let sqlQuery = `
            UPDATE \`Current Songs\` 
            SET`;

        const sqlValues: any[] = [];

        if (data.name !== null) {
            sqlQuery += ` name = ?,`;
            sqlValues.push(data.name);
        }

        if (data.twitter !== null) {
            sqlQuery += ` twitter = ?,`;
            sqlValues.push(data.twitter);
        }

        if (data.soundcloud !== null) {
            sqlQuery += ` soundcloud = ?,`;
            sqlValues.push(data.soundcloud);
        }

        if (data.soundxyz !== null) {
            sqlQuery += ` soundxyz = ?,`;
            sqlValues.push(data.soundxyz);
        }

        if (data.spotify !== null) {
            sqlQuery += ` spotify = ?,`;
            sqlValues.push(data.spotify);
        }

        if (data.audius !== null) {
            sqlQuery += ` audius = ?,`;
            sqlValues.push(data.audius);
        }

        if (data.newm !== null) {
            sqlQuery += ` newm = ?,`;
            sqlValues.push(data.newm);
        }

        if (data.bandcamp !== null) {
            sqlQuery += ` bandcamp = ?,`;
            sqlValues.push(data.bandcamp);
        }

        if (data.cover_art_url !== null) {
            sqlQuery += ` cover_art_url = ?,`;
            sqlValues.push(data.cover_art_url);
        }

        if (data.url !== null) {
            sqlQuery += ` url = ?,`;
            sqlValues.push(data.url);
        }

        if (data.youtube !== null) {
            sqlQuery += ` youtube = ?,`;
            sqlValues.push(data.youtube);
        }

        if (data.link !== null) {
            sqlQuery += ` link = ?,`;
            sqlValues.push(data.link);
        }

        if (data.artist !== null) {
            sqlQuery += ` artist = ?,`;
            sqlValues.push(data.artist);
        }

        if (data.genre !== null) {
            sqlQuery += ` genre = ?,`;
            sqlValues.push(data.genre);
        }

        if (data.sub_genre !== null) {
            sqlQuery += ` sub_genre = ?,`;
            sqlValues.push(data.sub_genre);
        }

        sqlQuery = sqlQuery.slice(0, -1);

        sqlQuery += ` WHERE album = ?`;

        sqlValues.push(asset_name); 

        await executeQuery(connection, sqlQuery, sqlValues);

    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
        throw new Error('Error inserting data into MySQL');
    }
}

async function getConnectionFromPool(pool: mysql.Pool): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

async function executeQuery(connection: mysql.PoolConnection, sqlQuery: string, sqlValues: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, sqlValues, (error, results, fields) => {
            connection.release(); 
            if (error) {
                reject(error);
            } else {
                console.log('Data updated successfully:', results);
                resolve();
            }
        });
    });
}

function addSpaces(str: string): string {
    return str.replace(/([A-Z])/g, ' $1').replace(/(?<=[a-zA-Z])(?=[0-9])/g, ' ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const epochUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest?epoch';
        const baseUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/assets/';

        const currentEpochResponse = await axios.get(epochUrl, {
            headers: { 'project_id': process.env.BLOCKFROST_PROJECT_ID }
        });

        const currentEpoch = currentEpochResponse.data.epoch;
        const nft = "SickCity" + currentEpoch;
        const asset_name = addSpaces(nft).trim();
        const filteredData = await fetchData();
     
        await insertDataIntoMySQL(filteredData, asset_name); 
        res.status(200).json({ message: 'Data fetched and inserted successfully' });
    } catch (error) {
        console.error('Error fetching and inserting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
