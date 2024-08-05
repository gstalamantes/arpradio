import type { NextApiRequest, NextApiResponse } from 'next';
import { create } from 'ipfs-http-client';

export const config = {
  api: {
    responseLimit: false, 
  },
}

const ipfs = create({ url: 'http://localhost:9095' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route called with query:', req.query);
  
  const { cid } = req.query;

  if (typeof cid !== 'string') {
    console.log('Invalid CID:', cid);
    return res.status(400).json({ error: 'Invalid CID' });
  }

  try {
    console.log(`Attempting to fetch from IPFS with CID: ${cid}`);
    
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Transfer-Encoding', 'chunked');

    
    for await (const chunk of ipfs.cat(cid)) {
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.log('Error streaming from IPFS:', error);
    console.log('Trying fetch via public gateway');
    res.status(404).end(); 
  }
}