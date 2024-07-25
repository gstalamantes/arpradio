import React, { useEffect, useState, useRef } from 'react';
import { createVerifiedFetch } from '@helia/verified-fetch';
import Image from 'next/image';
import Modal from "react-modal";

interface ArtProps {
  imageUrl: string;
}

const Art: React.FC<ArtProps> = ({ imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fetchedImageSrc, setFetchedImageSrc] = useState('');
  const [fetching, setFetching] = useState(false);
  const [showLinks, setShowLinks] = useState<boolean>(false);
  const abortControllerRef = useRef(new AbortController());
  const previousImageUrlRef = useRef(imageUrl);

  const links = () => setShowLinks(true);
  const closeLinks = () => setShowLinks(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 15000) => {
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
        const response = await fetch(`/api/fetch-ipfs?cid=${cid}`, { 
          signal: abortControllerRef.current.signal 
        });
        if (response.ok) {
          const isLocalFetch = response.headers.get('X-Local-Fetch') === 'success';
          if (isLocalFetch) {
            console.log(`Local IPFS fetch succeeded for CID: ${cid}`);
          }
          return response;
        }
      } catch (error) {
        console.error('Local IPFS API fetch failed:', error);
      }
      return null;
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

      let response: Response | null = null;
      let fetchUrls: string[] = [];

      if (imageUrl.startsWith('ipfs://')) {
        const cid = imageUrl.slice(7);
        
       
        response = await tryLocalFetch(cid);

        if (response) {
          console.log(`Image fetched from local IPFS for URL: ${imageUrl}`);
        } else {
          console.log(`Local fetch failed, trying other methods for URL: ${imageUrl}`);
        }
        
        // After the for loop that tries other fetch methods:
        if (response && response.ok) {
          console.log(`Image fetched using ${response.url.startsWith('https://ipfs.io') ? 'IPFS gateway' : 'verified fetch'} for URL: ${imageUrl}`);
        }
        
        if (!response) {

          fetchUrls = [imageUrl, `https://arpradio.media/ipfs/${cid}`];
        }
      } else if (imageUrl.startsWith('https://')) {
        fetchUrls = [imageUrl];
      } else {
        console.error('Unsupported URL format');
        setFetchedImageSrc('/default.png');
        setFetching(false);
        setImageLoaded(true);
        return;
      }

      
      if (!response) {
        for (const url of fetchUrls) {
          if (isCancelled) return;

          try {
            if (url === imageUrl && imageUrl.startsWith('ipfs://')) {
              const verifiedFetch = await createVerifiedFetch(
          
              );
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
    <div className="flex size-fit m-auto" onMouseEnter={links} onMouseLeave={closeLinks}>
      <Modal
        className="h-[400px] w-[260px] left-2/4 mr-[300px] rounded-lg top-1/2 border-2 border-neutral-500 -mt-[200px] bg-blue-800/80 fixed"
        overlayClassName="bg-transparent"
        isOpen={showLinks}
      >
        <div onMouseLeave={closeLinks} className="size-full text-center">
          Links
        </div>
      </Modal>
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