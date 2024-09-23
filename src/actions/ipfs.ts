// src/actions/ipfs.ts
'use server'

import { Readable } from 'stream'

const IPFS_API_URL = 'http://localhost:5001/api/v0'

async function ipfsRequest(path: string, method: string = 'POST', body?: FormData | URLSearchParams) {
  const response = await fetch(`${IPFS_API_URL}${path}`, {
    method,
    body,
  })

  if (!response.ok) {
    throw new Error(`IPFS request failed: ${response.statusText}`)
  }

  return response.json()
}

export async function uploadToIpfs(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  try {
    const buffer = await file.arrayBuffer()
    const formDataForIpfs = new FormData()
    formDataForIpfs.append('file', new Blob([buffer]), file.name)

    const result = await ipfsRequest('/add?stream-channels=true', 'POST', formDataForIpfs)
    return { success: true, cid: result.Hash }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}

export async function pinFiles(cids: string[]) {
  try {
    for (const cid of cids) {
      const params = new URLSearchParams({ arg: cid })
      await ipfsRequest('/pin/add', 'POST', params)
    }
    return { success: true }
  } catch (error) {
    console.error('Error pinning files:', error)
    return { success: false, error: 'Failed to pin files' }
  }
}