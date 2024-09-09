import React, { useEffect, useState, useRef } from 'react';
import { createVerifiedFetch } from '@helia/verified-fetch';
import Image from 'next/image';

interface ArtProps {
  imageUrl: string;
  width: number;
  height: number;
}

export const config = {
  api: {
    responseLimit: '8mb',
  },
}

const Art: React.FC<ArtProps> = ({ imageUrl, width, height }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fetchedImageSrc, setFetchedImageSrc] = useState('/default.png');
  const [fetching, setFetching] = useState(false);
  const abortControllerRef = useRef(new AbortController());
  const previousImageUrlRef = useRef(imageUrl);

  useEffect(() => {
    let isCancelled = false;

    const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 15000): Promise<Response> => {
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

    const fetchImage = async () => {
      if (!imageUrl || previousImageUrlRef.current === imageUrl) return;
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      previousImageUrlRef.current = imageUrl;

      setFetching(true);
      setImageLoaded(false);
      setFetchedImageSrc('/album.gif'); 

      let response: Response | null = null;
      let fetchUrls: string[] = [];

      if (imageUrl.startsWith('https://ipfs.io/ipfs/')) {
        const cid = imageUrl.slice(21);
        
        try {
          const apiResponse = await fetch(`http://127.0.0.1:8080/ipfs/${cid}`, {
            signal: abortControllerRef.current.signal
          });
          if (apiResponse.ok) {
            response = apiResponse;
          } 
        } catch (error) {
          console.error('API call for local IPFS fetch failed:', error);
        }
        
      } else if (imageUrl.startsWith('ipfs://')) {
        const cid = imageUrl.slice(7);
        fetchUrls = [`https://ipfs.io/ipfs/${cid}`];
      } else if (imageUrl.startsWith('https://')) {
        fetchUrls = [imageUrl];
      } else {
        console.error('Unsupported URL format');
        setFetching(false);
        setImageLoaded(true);
        return;
      }

      if (!response && fetchUrls.length > 0) {
        for (const url of fetchUrls) {
          if (isCancelled) return;

          try {
            if (url === imageUrl && imageUrl.startsWith('ipfs://')) {
              const verifiedFetch = await createVerifiedFetch();
              response = await verifiedFetch(url, { signal: abortControllerRef.current.signal });
            } else {
              response = await tryFetch(url);
            }

            if (response.ok) {
              break;
            }
          } catch (error) {
            console.error(`Fetch failed for ${url}:`, error);
          }
        }
      }

      if (isCancelled) return;

      if (!response || !response.ok) {
        console.error('All fetch attempts failed. Using default image.');
        setFetching(false);
        setImageLoaded(true);
        return;
      }

      try {
        const blob = await response.blob();
        const imageSrc = URL.createObjectURL(blob);
        
        setFetchedImageSrc(imageSrc);
        setImageLoaded(true);
      } catch (error) {
        console.error('Error setting up image:', error);
        setImageLoaded(true);
      } finally {
        if (!isCancelled) {
          setFetching(false);
        }
      }
    };

    fetchImage();

    return () => {
      isCancelled = true;
      abortControllerRef.current.abort();
    };
  }, [imageUrl]);

  return (
    <div className="flex size-fit m-auto mt-4">
      <Image
        height={height}
        width={width}
        className={`mx-auto my-1 border-[1px] rounded border-zinc-700/50`}
        id="art"
        src={fetchedImageSrc}
        alt="Cover Art"
      />
    </div>
  );
};

export default Art;