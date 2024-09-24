'use client'

import { useState, useEffect, useTransition } from 'react';
import UpvoteButton from '@/components/upVote';
import Link from 'next/link';
import Image from 'next/image';
import { resolveFingerprint } from '@meshsdk/core';
import { fetchSongs, ResultEntry } from "@/utils/fetchSongs"

export default function SearchableResults({ 
  search,
  arpOnly: initialArpOnly
}: { 
  search?: string,
  arpOnly: boolean
}) {
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [isPending, startTransition] = useTransition();
  const [arpOnly, setArpOnly] = useState(initialArpOnly);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setIsInitialLoading(true);
    startTransition(() => {
      fetchSongs(search || '', '', arpOnly).then(data => {
        setResults(data);
        setTimeout(() => setIsInitialLoading(false), 300); 
      });
    });
  }, [search, arpOnly]);

  const handleSearch = async (formData: FormData) => {
    let artist = '';
    let genre = '';
    let searchTerm = '';

    if (arpOnly) {
      artist = formData.get('artist') as string;
      genre = formData.get('genre') as string;
    } else {
      searchTerm = formData.get('search') as string;
      artist = searchTerm;
      genre = searchTerm;
    }

    setIsInitialLoading(true);
    startTransition(() => {
      fetchSongs(artist, genre, arpOnly).then(data => {
        setResults(data);
        setTimeout(() => setIsInitialLoading(false), 300); 
      });
    });
  };

  const renderResult = (item: ResultEntry) => {
    if ('song_id' in item) {
      return (
        <div key={item.song_id} className="bg-zinc-800 px-2 pb-1 rounded-lg w-48 h-[9.5rem] mx-auto shadow-md">
          <div className="h-[6rem] items-center overflow-hidden mx-auto">
            <h3 className="text-amber-400 text-[.9rem]">{item.name}</h3>
            <h2 className="text-sm font-semibold">{item.artist}</h2>
            <p className="text-xs text-gray-300">{item.album}</p>
          </div>
          <UpvoteButton />
        </div>
      );
    } else {
      const fingerprint = resolveFingerprint(item.policyid, item.assetname)
      return (
        <Link key={fingerprint} href={`releases/${fingerprint}?policy_id=${item.policyid}&name=${encodeURIComponent(item.name)}`}>
          <div className="bg-zinc-800 px-2 pb-1 rounded-lg w-48 h-24 mx-auto shadow-md">
            <div className="h-[6rem] items-center overflow-hidden mx-auto">
              <h3 className="text-amber-400 text-[.9rem]">{item.name}</h3>
              <h2 className="text-sm font-semibold">{item.assetname}</h2>
              <p className="text-xs text-gray-300">Policy ID: {item.policyid.substring(0, 8)}...</p>
            </div>
          </div>
        </Link>
      );
    }
  };

  return (
    <>
      <form className="flex ml-auto mr-4 w-fit" action={handleSearch}>
        <div className="md:flex h-fit justify-between  ">
          <div className="w-36 flex">
            <label className="text-[.4rem] md:text-xs w-fit">Arp Songs Only</label>
            <input
              type="checkbox"
              checked={arpOnly}
              onChange={(e) => setArpOnly(e.target.checked)}
              className="mr-2 h-4 "
            />
          </div>
          
          {arpOnly ? (
            <>
              <input
                type="text"
                name="artist"
                placeholder="Artist"
                className="border h-6 mx-2 w-36 p-1  text-black"
              />
              <input
                type="text"
                name="genre"
                placeholder="Genre"
                className="border h-6 w-36 p-1  text-black"
              />
            </>
          ) : (
            <input
              type="text"
              name="search"
              placeholder="Search"
              className="border p-1 h-6  text-black"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="border-[1px] my-auto h-fit ml-2 px-2 border-zinc-400 "
        >
          {isPending ? 'Searching...' : 'Go'}
        </button>
      </form>
      <hr className="mb-2"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 font-mono gap-2 h-[40dvh] p-4 overflow-y-auto">
        {isPending || isInitialLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center h-full">
            <Image src="/album.gif" width={100} height={100} alt="Loading"/>
            <h1 className=" mt-4 font-mono text-sm">Fetching Data...</h1>
          </div>
        ) : results.length > 0 ? (
          results.map((item) => renderResult(item))
        ) : (
          <div className="col-span-full flex items-center justify-center h-full">
            <h1 className="font-mono text-2xl">No Matches Found.</h1>
          </div>
        )}
      </div>
    </>
  );
}