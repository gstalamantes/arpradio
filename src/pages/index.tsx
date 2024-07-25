import { useEffect } from "react";
import { useSongs } from "@/components/songs";
import Art from "@/components/art";
import { useIndex } from "@/components/currentSong";

export default function Home() {
  const { songs } = useSongs();
  const { index } = useIndex(); 
  
  useEffect(() => {
    
    const artistElement = document.getElementById("artistName");
    const albumElement = document.getElementById("releaseName");
    const songElement = document.getElementById("songName");

    if (artistElement && songs[index]) {
      const artist = songs[index].artist || "Unknown Artist";
      artistElement.setAttribute("data-artist", artist);
      artistElement.textContent = artist;
    }

    if (albumElement && songs[index]) {
      const album = songs[index].album || "Unknown Album";
      albumElement.setAttribute("data-album", album);
      albumElement.textContent = album;
    }

    if (songElement && songs[index]) {
      const song = songs[index].name || "Unknown Song";
      songElement.setAttribute("data-song", song);
      songElement.textContent = song;
    }
  }, [index, songs]);
  useIndex();

  return (
    <div className="flex flex-col min-h-screen justify-center">
      <div className="rounded-lg bg-black/50 text-center md:block mx-auto border-4 px-20 items-center -mt-96 py-1 border-neutral-600 text-center">
      <Art imageUrl={songs[index]?.cover_art_url || ""} />
        <div className="inline-block w-fit px-2 text-xl m-auto md:text-2xl">
          <div className=" w-fit py-2 mx-auto" id="songName">Song</div>
          <div className="text-xs pb-2">by</div>
          <div className="pb-2" id="artistName">Artist</div>
          <span className="text-xs hidden">feat. <span id="featureName">Artist</span></span>
          <div className="pb-2" id="releaseName">Release</div>
        </div>
      </div>
 
    </div>
  );
}
