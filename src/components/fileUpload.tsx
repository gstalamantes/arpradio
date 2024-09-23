'use client'

import React, { useState } from 'react';
import { uploadToIpfs } from '@/actions/ipfs';

interface FileUploadProps {
  name: string;
  accept: string;
  required: boolean;
  onUploadComplete: (cid: string) => void;
}

export default function FileUpload({ name, accept, required, onUploadComplete }: FileUploadProps) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadToIpfs(formData);
      if (result.success && result.cid) {
        onUploadComplete(result.cid);
        setProgress(100);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        name={name}
        accept={accept}
        required={required}
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}