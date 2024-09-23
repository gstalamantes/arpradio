import React, { useEffect, useRef, useState } from 'react';
import { createVerifiedFetch } from '@helia/verified-fetch';

interface AudioProps {
  songUrl: string;
  onNext: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
const Audio: React.FC<AudioProps> = ({ songUrl, onNext, isLoading }) => {

  const abortControllerRef = useRef(new AbortController());
  const previousSongUrlRef = useRef(songUrl);



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

    const fetchAudio = async () => {
      const audioElement = document.getElementById('audio') as HTMLAudioElement | null;
      if (!audioElement || !songUrl) return;

      if (previousSongUrlRef.current === songUrl) return; 

      abortControllerRef.current.abort(); 
      abortControllerRef.current = new AbortController(); 

      previousSongUrlRef.current = songUrl; 

      let response: Response | null = null;
      let fetchUrls: string[] = [];

      if (songUrl.startsWith('https://ipfs.io/ipfs/')) { 
        const cid = songUrl.slice(21);
        
        try {
          const apiResponse = await fetch(`http://127.0.0.1:8080/ipfs/${cid}`, {
            signal: abortControllerRef.current.signal
          
          });
          if (apiResponse.ok) {
            response = apiResponse;
          };
        } catch (error) {
          console.error('API call for local IPFS fetch failed:', error);
        }
        
        if (!response) {
          const directUrl = `https://ipfs.io/ipfs/${cid}`;
          fetchUrls = [songUrl, directUrl, cid];
        }
      } else if (!songUrl.startsWith('https://ipfs.io/ipfs/')) {
        fetchUrls = [songUrl];
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
       
        onNext(); 
        return;
      }

      try {
        const blob = await response.blob();
      
        audioElement.src = URL.createObjectURL(blob);
        audioElement.oncanplay = () => {
          audioElement.play().catch(playError => {
            console.error('Audio playback error:', playError);
            
          });
        };

        audioElement.onerror = (event) => {
          console.error('Audio error:', event);

        };
      } catch (error) {
        console.error('Error setting up audio:', error);
       
        
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
      
      <audio preload="auto" id="audio"></audio>
    </>
  );
};

export default Audio;