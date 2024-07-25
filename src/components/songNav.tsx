import React, { useState, useEffect } from "react";
import { useSongs } from "./songs";
import Image from "next/image";

interface SongNavigationProps {
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const SongNavigation: React.FC<SongNavigationProps> = ({ currentIndex, onPrev, onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    
    const handlePlayPause = () => {
      setIsPlaying(!audio.paused);
    };

    audio.addEventListener('play', handlePlayPause);
    audio.addEventListener('pause', handlePlayPause);

    return () => {
      audio.removeEventListener('play', handlePlayPause);
      audio.removeEventListener('pause', handlePlayPause);
    };
  }, []);

  const play = () => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    if (audio.paused && audio.src) {
      audio.play();
    } else {
      audio.pause();
    }
    if (!audio.src) {
      alert("Select a Playlist.");
    }
  };

  return (
    <div id="control" className="flex rounded-2xl md:border-2 px-1 mb-2  w-72 mx-auto  border-4 border-neutral-300/70">
      <span className="flex w-64 justify-evenly text-xs m-auto text-white/50">
        <button className=" px-1 mt-auto " onClick={onPrev}> <Image className="control" src="/prev.png" width={100} height={100} alt=""/></button>
        <button className=" px-1 mt-auto" onClick={play}>
          <Image 
            id="play" 
            className="play" 
            src={isPlaying ? "/pause.png" : "/play.png"} 
            width={100} 
            height={100} 
            alt=""
          />
        </button>
        <button className=" px-1 mt-auto" onClick={onNext}><Image className="control" src="/next.png" width={100} height={100} alt=""/></button>
      </span>
    </div>
  );
};

export default SongNavigation;