import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface AudioInputProps {
  onAudioChange: (file: File) => void;
}

const AudioInput: React.FC<AudioInputProps> = ({ onAudioChange }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  
  const handleAudioChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    onAudioChange(file); 
    setUploadProgress(0);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await axios.post('/api/pin-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setUploadProgress(percentCompleted);
        },
      });

      console.log('Pinning result:', response.data);
      setCid(response.data.cid);
    } catch (error: unknown) {
      console.error('Error pinning audio:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Failed to pin audio. Please try again.');
      } else if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data?.error || 'Failed to pin audio. Please try again.');
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    } finally {
      setUploadProgress(0);
    }
  };

  return (
    <div className="formInputs">
      <h1 className="formHead">Audio File:</h1>
      <h2 className="formDesc">Upload an audio file for the song.</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        className="formInputs"
        style={{
          color: 'white',
          background: 'darkblue',
          borderRadius: '4px',
          justifyContent: 'center',
          outline: 'outset 1px silver',
          border: 'inset 1px gold',
          padding: '5px',
        }}
      />
      {uploadProgress > 0 && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {cid && <p>CID: {cid}</p>}
    </div>
  );
};

export default AudioInput;