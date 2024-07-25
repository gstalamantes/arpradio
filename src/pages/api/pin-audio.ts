import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { webSockets } from '@libp2p/websockets';
import { bootstrap } from '@libp2p/bootstrap';
import { MemoryDatastore } from 'datastore-core';
import { createRemotePinner } from '@helia/remote-pinning';
import { Configuration, RemotePinningServiceClient } from '@ipfs-shipyard/pinning-service-client';

export const config = {
  api: {
    bodyParser: false,
  },
};

let helia: any, remotePinner: any;

async function initializeHelia() {
  const datastore = new MemoryDatastore();

  const libp2pNode = await createLibp2p({
    datastore,
    transports: [webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    peerDiscovery: [
      bootstrap({
        list: [
         
          ' /ip4/192.168.1.129/tcp/9096/p2p/12D3KooWK32QMRUeLkj22ENefMfcQnCn4Ad6uFxxdNpoeDZLJN1L'
        ],
      }),
    ],
  });

  helia = await createHelia({ libp2p: libp2pNode });
  const pinServiceConfig = new Configuration({
    endpointUrl: 'http://127.0.0.1:9097',
    accessToken: process.env.ARP_CLUSTER_PIN,
  });
  const remotePinningClient = new RemotePinningServiceClient(pinServiceConfig);
  remotePinner = createRemotePinner(helia, remotePinningClient);
}

initializeHelia();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const form = formidable();
  
    try {
      const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });
  
      const audioFiles = files.audio as formidable.File[];
      if (!audioFiles || audioFiles.length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const file = audioFiles[0];  
      console.log(`Processing file: ${file.originalFilename || 'unnamed_file'}`);
  
      const fileContent = await fs.readFile(file.filepath);
      const heliaFs = unixfs(helia);
      const cid = await heliaFs.addBytes(fileContent, {
        cidVersion: 0,
      });
  
      console.log(`Generated CID: ${cid.toString()}`);
  
      const addPinResult = await remotePinner.addPin({
        cid: cid,
        name: file.originalFilename || 'unnamed_file',
      });
  
      console.log(`Pinning result:`, addPinResult);
  
      res.json({ cid: cid.toString(), pinningResult: addPinResult });
    } catch (error: unknown) {
      console.error('Error processing file:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
      } else {
        res.status(500).json({ error: 'Failed to process file', details: 'An unknown error occurred' });
      }
    }
  }