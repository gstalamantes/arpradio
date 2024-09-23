'use client'

import React, { useEffect, useState } from "react";
import { useMusic } from "@/providers/songs";
import { getMetadata } from "@/utils/getMetadata";
import Art from "@/components/art";
import Link from "next/link";
import LikeButton from "@/components/likeButton";
import UpvoteButton from "@/components/upVote";
import { resolveFingerprint } from "@meshsdk/core";

interface MetadataResult {
  name: string | null;
  artists: Array<{ name: string }>;
  releaseTitle: string | null;
  imageUrl: string | null;
}

export default function Radio() {
  const { songs, index } = useMusic();
  const [metadata, setMetadata] = useState<MetadataResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetadata() {
      if (songs[index]) {
        setIsLoading(true);
        const { policy_id, asset_name } = songs[index];
        const fetchedMetadata = await getMetadata(policy_id, asset_name);
        setMetadata(fetchedMetadata as MetadataResult);
        setIsLoading(false);
      }
    }

    fetchMetadata();
  }, [songs, index]);

  const songName = metadata?.name || "No Song Selected";
  const artistName = metadata?.artists[0]?.name || "--";
  const releaseName = metadata?.releaseTitle || "--";
  const coverArt = metadata?.imageUrl || "/default.png";
  const policyId = songs[index]?.policy_id;
  const assetName = songs[index]?.asset_name;
  const fingerprint = policyId && assetName ? resolveFingerprint(policyId, assetName) : null;

  const tokenHref = fingerprint
    ? `/releases/${fingerprint}?policy_id=${encodeURIComponent(policyId)}&name=${encodeURIComponent(assetName)}`
    : "#";

  return (
    <>
      <div id="radio" className="flex">
        <div className="mx-auto">
          <Link href={tokenHref}>
            <Art imageUrl={coverArt} height={200} width={200} />
          </Link>
          <h1 id="songName" className="text-zinc-200 font-bold mb-1 lg:text-xl text-xl mt-2">{songName}</h1>
          <h2 id="artistName" className="text-amber-300/80 text-lg lg:text-xl">{artistName}</h2>
          {metadata?.artists.slice(1).map((artist, index) => (
            <React.Fragment key={artist.name}>
              <span className="text-xs pb-4 lg:text-lg mr-1">ft.</span>
              <span className="text-[.8rem] text-lg lg:text-xl">{artist.name}</span>
            </React.Fragment>
          ))}
          <h2 id="releaseName" className="lg:text-base mt-2 text-xs pb-2">{releaseName}</h2>
        </div>
      </div>
      <div className="flex justify-evenly mx-auto mb-2">
        <LikeButton />
        <UpvoteButton />
      </div>
    </>
  );
}