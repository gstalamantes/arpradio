import React, { useEffect, useRef, useState } from 'react';
import { createVerifiedFetch } from '@helia/verified-fetch';
import Image from 'next/image';

interface AudioProps {
  songUrl: string;
  onNext: () => void;
}

const Modal: React.FC<{ show: boolean; message: string; onClose: () => void }> = ({ show, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed m-auto">
      <div className="flex justify-evenly h-24 w-48 rounded-2xl ml-10 fixed top-96 border-2 border-neutral-400 text-white text-xl bg-black/90">
        <Image className="m-4" src="/album.gif" width={40} height={40} alt="loading..." />
        <h2 className="my-auto mr-6">{message}</h2>
      </div>
    </div>
  );
};

const Audio: React.FC<AudioProps> = ({ songUrl, onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const abortControllerRef = useRef(new AbortController());
  const previousSongUrlRef = useRef(songUrl);

  const clearError = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 8000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    };

    const tryFetch = async (url: string): Promise<Response> => {
      try {
        return await fetchWithTimeout(url, { signal: abortControllerRef.current.signal });
      } catch (error) {
        console.error(`Fetch failed for ${url}:`, error);
        throw error;
      }
    };

    const setErrorWithTimeout = (message: string) => {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage('');
      }, 1500);
    };

    const fetchAudio = async () => {
      const audioElement = document.getElementById('audio') as HTMLAudioElement | null;
      if (!audioElement || !songUrl) return;

      if (previousSongUrlRef.current === songUrl) return; 

      abortControllerRef.current.abort(); 
      abortControllerRef.current = new AbortController(); 

      previousSongUrlRef.current = songUrl; 

      setIsLoading(true);
      setErrorMessage('');

      let response: Response | null = null;
      let fetchUrls: string[] = [];

      if (songUrl.startsWith('https://ipfs.io/ipfs/')) { 
        const cid = songUrl.slice(21);
        
        try {
          const apiResponse = await fetch(`/api/ipfsLocal?cid=${cid}`, {
            signal: abortControllerRef.current.signal
          });
          if (apiResponse.ok) {
            response = apiResponse;
          }
        } catch (error) {
          console.error('API call for local IPFS fetch failed:', error);
        }
        
        if (!response) {
          const directUrl = `https://ipfs.io/ipfs/${cid}`;
          fetchUrls = [songUrl, directUrl, cid];
        }
      } else if (!songUrl.startsWith('https://ipfs.io/ipfs/')) {
        fetchUrls = [songUrl];
      } else {
        setErrorWithTimeout('Unsupported URL format');
        setIsLoading(false);
        return;
      }

      if (!response) {
        for (const url of fetchUrls) {
          if (isCancelled) return;

          try {
            if (url === songUrl && songUrl.startsWith('ipfs://')) {
              const verifiedFetch = await createVerifiedFetch();
              response = await verifiedFetch(url, { signal: abortControllerRef.current.signal });
            } else {
              response = await tryFetch(url);
            }

            if (response.ok) break;
          } catch (error) {
            console.error(`Fetch failed for ${url}:`, error);
          }
        }
      }

      if (isCancelled) return;

      if (!response || !response.ok) {
        setErrorWithTimeout('Failed to load audio. Please try again.');
        setIsLoading(false);
        onNext(); 
        return;
      }

      try {
        const blob = await response.blob();
      
        audioElement.src = URL.createObjectURL(blob);
        audioElement.oncanplay = () => {
          audioElement.play().catch(playError => {
            console.error('Audio playback error:', playError);
            setErrorWithTimeout('Playback failed. Please try again.');
          });
        };

        audioElement.onerror = (event) => {
          console.error('Audio error:', event);
          setErrorWithTimeout('Audio failed to load. Please try again.');
        };
      } catch (error) {
        console.error('Error setting up audio:', error);
        setErrorWithTimeout('Failed to set up audio. Please try again.');
        
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAudio();

    return () => {
      isCancelled = true;
      abortControllerRef.current.abort(); 
    };
  }, [songUrl, onNext]);

  return (
    <>
      <Modal 
        show={isLoading || !!errorMessage} 
        message={errorMessage || 'Loading...'} 
        onClose={clearError}
      />
      <audio preload="auto" id="audio"></audio>
    </>
  );
};

export default Audio;