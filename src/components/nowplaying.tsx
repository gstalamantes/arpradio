import { useState, useEffect } from "react";
import { useSongs } from "@/components/songs";
import { useIndex } from "@/components/currentSong";

export default function NowPlaying() {
  const { songs } = useSongs();
  const { index } = useIndex();
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  useEffect(() => {
    const artistElement = document.getElementById("artistName");
    const songElement = document.getElementById("songName");

    if (artistElement && songElement && songs[index]) {
      const artist = songs[index].artist || "Unknown Artist";
      const song = songs[index].name || "Unknown Song";

      artistElement.setAttribute("data-artist", artist);
      artistElement.textContent = artist;

      songElement.setAttribute("data-song", song);
      songElement.textContent = song;

      setShowNowPlaying(true);

      const timer = setTimeout(() => {
        setShowNowPlaying(false);
      }, 2600);

      return () => clearTimeout(timer);
    }
  }, [index, songs]);

  return (
    <div
      id="nowPlaying"
      className={`fixed w-full mx-auto text-center bg-black text-2xl rounded-xl border-4 border-neutral-300 ${
        showNowPlaying ? "block" : "hidden"
      }`}
    >
      <h1>Now Playing:</h1>
      <div className="p-4">
        <div className="text-amber-600" id="songName"></div> by{" "}
        <div className="text-cyan-500" id="artistName"></div>
      </div>
    </div>
  );
}