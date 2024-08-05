import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ARPRADIO_IPFS_URL = 'http://localhost:9095/api/v0';

// List of remote pinning services to use
const REMOTE_PINNING_SERVICES = ['Arp',  'Local Pinning']; // Replace with actual service names

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

    // Read file content
    const fileContent = await fs.readFile(file.filepath);

    // Prepare form data for ARPRadio IPFS gateway
    const formData = new FormData();
    formData.append('file', fileContent, {
      filename: file.originalFilename || 'unnamed_file',
      contentType: file.mimetype || 'application/octet-stream',
    });

    // Add file to IPFS using ARPRadio gateway
    const addResponse = await axios.post(`${ARPRADIO_IPFS_URL}/add`, formData, {
      headers: formData.getHeaders(),
    });

    const { Hash: cid } = addResponse.data;
    console.log(`Generated CID: ${cid}`);

    // Pin to all specified remote services
    const pinnedServices = [];
    for (const service of REMOTE_PINNING_SERVICES) {
      try {
        await axios.post(`${ARPRADIO_IPFS_URL}/pin/remote/add`, null, {
          params: {
            arg: cid,
            service: service,
          },
        });
        console.log(`Pinned to service: ${service}`);
        pinnedServices.push(service);
      } catch (error) {
        console.error(`Failed to pin to service ${service}:`, error);
      }
    }

    res.json({ cid: cid, pinnedServices: pinnedServices });
  } catch (error: unknown) {
    console.error('Error processing file:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to process file', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to process file', details: 'An unknown error occurred' });
    }
  }
}