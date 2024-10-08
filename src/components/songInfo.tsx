"use client"

import { useEffect, useState } from "react";
import { useMusic } from "../providers/songs";
import Art from "./art";
import Link from "next/link";
import { resolveFingerprint } from "@meshsdk/core";

export default function SongInfo() {
  const { songs, index } = useMusic();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (songs[index]) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [songs, index]);

  useEffect(() => {
    if (isLoaded && songs[index]) {
      const songElement = document.getElementById("songName");
      const artistElement = document.getElementById("artistName");
      const releaseElement = document.getElementById("releaseName");

      if (songElement) {
        songElement.setAttribute("data-song", songs[index].name);
        songElement.textContent = songs[index].name;
      }

      if (artistElement) {
        artistElement.setAttribute("data-artist", songs[index].artist);
        artistElement.textContent = songs[index].artist;
      }

      if (releaseElement) {
        releaseElement.setAttribute("data-album", songs[index].album);
        releaseElement.textContent = songs[index].album;
      }
    }
  }, [isLoaded, songs, index]);

  const songName = isLoaded ? songs[index].name : "No Song Selected";
  const artistName = isLoaded ? songs[index].artist : "--";
  const releaseName = isLoaded ? songs[index].album : "--";
  const featureName = isLoaded ? songs[index].feature_name : null;
  const coverArt = isLoaded ? songs[index].cover_art_url : "/default.png";
  const policyId = isLoaded ? songs[index].policy_id : null;
  const assetName = isLoaded ? songs[index].asset_name : null;
  const fingerprint = isLoaded ? resolveFingerprint(songs[index]?.policy_id, songs[index]?.asset_name) : null;

  const tokenHref = isLoaded
    ? `/releases/${fingerprint}?policy_id=${encodeURIComponent(policyId)}&name=${encodeURIComponent(assetName)}`
    : "#";

  return (
    <div className="mx-auto">
      <Link href={tokenHref}>
        <Art imageUrl={coverArt} height={200} width={200} />
      </Link>
      <h1 id="songName" className="text-zinc-200 font-bold mb-1 lg:text-xl text-xl mt-2">{songName}</h1>
      <h2 id="artistName" className="text-amber-300/80 text-lg lg:text-xl">{artistName}</h2>
      {featureName && (
        <>
          <span className="text-xs pb-4 lg:text-lg mr-1">ft.</span>
          <span className="text-[.8rem] text-lg lg:text-xl">{featureName}</span>
        </>
      )}
      <h2 id="releaseName" className="lg:text-base mt-2 text-xs pb-2">{releaseName}</h2>
    </div>
  );
}