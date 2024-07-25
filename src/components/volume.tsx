import { useEffect, useState } from "react";

export function Volume() {
  const [muted, setMuted] = useState<boolean>(false);
  const [mutedVol, setMutedVol] = useState<number>(82); 

  function mute() {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    const volumeSlider = document.getElementById("global-volume-slider") as HTMLInputElement;

    if (muted) {
      audio.volume = Number(volumeSlider.value) / 100; 
      setMuted(false);
    } else {
      setMutedVol(audio.volume * 100); 
      audio.volume = 0; 
      setMuted(true);
    }

    console.log(`Mute: ${!muted}`); 
  }

  useEffect(() => {
    const volumeSlider = document.getElementById("global-volume-slider") as HTMLInputElement;
    const audio = document.getElementById("audio") as HTMLAudioElement;

    const setVolume = () => {
      if (!muted) {
        audio.volume = Number(volumeSlider.value) / 100;
      }
      volumeSlider.title = `Volume: ${audio.volume * 100}%`;
    };

    volumeSlider.addEventListener("input", setVolume);

    return () => {
      volumeSlider.removeEventListener("input", setVolume);
    };
  }, [muted]);

  return (
    <div className=" w-fit h-fit  rounded-2xl">
     
      <div className="p-1 rounded-2xl h-fit bg-neutral-800/20 border-2 border-neutral-500/50 text-xs text-center">
        <div
          id="mute"
          onClick={mute}
          className={` rounded-md  p-1 w-fit m-auto mb-2  border-4 border-black/80 cursor-pointer ${
            muted ? "animate-blink bg-red-300" : "bg-rose-950"
          }`}
        >MUTE
          
        </div>
        <input
          defaultValue={"82"}
          type="range"
          id="global-volume-slider"
          min="0"
          max="100"
          step=".5"
          
      className="m-auto cursor-pointer"
        ></input><div>VOL</div>
      </div>
    </div>
  );
}
