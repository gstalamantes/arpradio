import React, { useEffect, useState, useRef } from 'react';
import { createVerifiedFetch, VerifiedFetch } from '@helia/verified-fetch';
import Image from 'next/image';

interface ArtProps {
  imageUrl: string;
}

export const config = {
  api: {
    responseLimit: '8mb',
  },
}

const Art: React.FC<ArtProps> = ({ imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fetchedImageSrc, setFetchedImageSrc] = useState('');
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

    const tryLocalFetch = async (cid: string): Promise<Response | null> => {
      try {
        const response = await fetch(`/api/ipfsLocal?cid=${cid}`, { 
          signal: abortControllerRef.current.signal 
        });
        console.log('Image')
        if (response.ok) {
          console.log("Local IPFS fetch succeeded for CID:", cid);
          return response;
        } else {
          console.log("Local IPFS fetch failed, status:", response.status);
          return null;
        }
      } catch (error) {
        console.error('Local IPFS API fetch failed:', error);
        return null;
      }
    };

    const fetchParallel = async (fetchFunctions: (() => Promise<Response | null>)[]): Promise<Response> => {
      const responses = await Promise.all(fetchFunctions.map(fn => fn().catch(() => null)));
      const successfulResponse = responses.find(r => r && r.ok);
      if (successfulResponse) return successfulResponse;
      throw new Error('All fetches failed');
    };

    const fetchImage = async () => {
      if (!imageUrl || previousImageUrlRef.current === imageUrl) return;
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      previousImageUrlRef.current = imageUrl;

      setFetching(true);
      setImageLoaded(false);

      let response: Response | null = null;
      let fetchFunctions: (() => Promise<Response | null>)[] = [];

      if (imageUrl.startsWith('ipfs://')) {
        const cid = imageUrl.slice(7);
        
        response = await tryLocalFetch(cid);

        if (!response) {
          console.log(`Local fetch failed, trying other methods for URL: ${imageUrl}`);
          const urls = [
            `https://ipfs.io/ipfs/${cid}`, 
            `https://arpradio.media/ipfs/${cid}`
          ];
          fetchFunctions = urls.map(url => () => fetchWithTimeout(url, { signal: abortControllerRef.current.signal }));
          
          // Add verified fetch for the original ipfs:// URL
          const verifiedFetch = await createVerifiedFetch();
          fetchFunctions.push(() => verifiedFetch(imageUrl, { signal: abortControllerRef.current.signal }));
        }
      } else if (imageUrl.startsWith('https://')) {
        fetchFunctions = [() => fetchWithTimeout(imageUrl, { signal: abortControllerRef.current.signal })];
      } else {
        console.error('Unsupported URL format');
        setFetchedImageSrc('/default.png');
        setFetching(false);
        setImageLoaded(true);
        return;
      }

      if (!response && fetchFunctions.length > 0) {
        try {
          response = await fetchParallel(fetchFunctions);
        } catch (error) {
          console.error('All fetch attempts failed:', error);
        }
      }

      if (isCancelled) return;

      if (!response || !response.ok) {
        console.error('Failed to load image. Using default image.');
        setFetchedImageSrc('/default.png');
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
        setFetchedImageSrc('/default.png');
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
    <div className="flex size-fit m-auto" >
      <Image
        height={100}
        width={100}
        className="w-48 h-48 md:w-[180px] md:h-[180px] mx-auto my-3 border-2 rounded p-1 border-neutral-300/30"
        id="art"
        src={fetching ? "/album.gif" : (imageLoaded ? fetchedImageSrc : "/default.png")}
        alt="Art"
      />
    </div>
  );
};

export default Art;