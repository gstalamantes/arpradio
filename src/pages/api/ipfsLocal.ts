import type { NextApiRequest, NextApiResponse } from 'next';
import { create } from 'ipfs-http-client';

export const config = {
  api: {
    responseLimit: '38mb',
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
    
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    
    const fileContent = Buffer.concat(chunks);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', fileContent.length);

    res.send(fileContent);

  } catch (error) {
    console.log('Trying fetch via public gateway');
    res.status(404).end(); 
  }
}