import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cid } = req.query

  if (!cid || typeof cid !== 'string') {
    return res.status(400).json({ error: 'Invalid CID' })
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); 

  try {
    const localUrl = `http://localhost:9095/ipfs/${cid}`
    const response = await fetch(localUrl, { 
      signal: controller.signal 
    });

    clearTimeout(timeoutId);

  if (response.ok) {
  console.log("Local IPFS Provider succeeded for CID:", cid);
  res.setHeader('X-Local-Fetch', 'success');
}

    if (!response.ok) {
      throw new Error('Local fetch failed')
    }

    const data = await response.arrayBuffer()
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream')
    res.send(Buffer.from(data))
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    console.error('Error fetching from local IPFS:', error)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        res.status(504).json({ error: 'Local IPFS fetch timed out' })
      } else {
        res.status(502).json({ error: 'Failed to fetch from local IPFS' })
      }
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' })
    }
  }
}