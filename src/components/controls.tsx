import React, { useEffect, useState, ChangeEvent } from "react";
import Audio from "./ipfsCat";
import { Volume } from "@/components/volume";
import { useSongs } from "./songs";
import SongNavigation from "./songNav";
import { useIndex } from "./currentSong";


export function Controls() {
  const { songs, setSongs } = useSongs();
  const [currentPlaylist, setCurrentPlaylist] = useState<string>("top50");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const {index, setIndex} = useIndex();
  const [shuffle, setShuffle] = useState<boolean>(false);
  

  useEffect(() => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    const handleEnded = () => { next(); };
    if (audio) { audio.addEventListener('ended', handleEnded); }

    return () => { if (audio) { audio.removeEventListener('ended', handleEnded); } };
  }, [index, shuffle, songs]);

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

  useEffect(() => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.75;
      console.log(audio.volume)
    }
  }, []);

  const handlePlaylistChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    const selected = event.target.value;
    setCurrentPlaylist(selectedPlaylist);
    setSelectedPlaylist(selected);
    
    try {
      const response = await fetch(`/api/playlist?playlist=${encodeURIComponent(selected)}`);

      if (response.ok) {
        audio.src="";
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0]?.url) {
          setSongs(data);
          setIndex(0);
         
        } else {
          alert('No songs found.');
          setSelectedPlaylist(selectedPlaylist);
          if (audio.src) audio.play()
        }
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const next = () => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    audio.pause();
    if (!audio.src){alert("No songs to play.")}
    if (index + 1 === songs.length) {
      alert("End of Playlist.");
      return; 
    }
    ;
    setIndex(index + 1);
  };

  const prev = () => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    audio.pause();
    if (!audio.src){console.log("No Songs.");return}
    if (index === 0) {
      alert("This is the first song.");
      return;
    }
    setIndex(index - 1);
  };

  return (
   <div id="foot" className="border-2  flex max-w-[700px] h-42 w-full md:w-3/5 m-12 rounded-xl   mx-auto mt-auto text-center">
      
      <div className="w-24 "></div>
      <div className="ml-auto">
      <Audio songUrl={songs[index]?.url || ""} onNext={next} />
        <h2>Playlist</h2>
        <select id="playlist" className="m-auto block text-black  rounded-full mb-4 border-4 border-cyan-600 text-center" onChange={(event) => handlePlaylistChange(event)} value={selectedPlaylist}>
          <option value="feature"> Select a Playlist</option>
          <option value="top50">Top 50</option>
          <option value="latest">Latest</option>
        </select>
        <SongNavigation
          currentIndex={index}
          onPrev={prev}
          onNext={next}
        />
    
      </div>
     
      <div className=" w-fit ml-auto mr-5 my-auto " > <Volume/></div> 
    </div>
  );
}
