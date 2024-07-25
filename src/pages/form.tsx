import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import SongComponent from '@/components/SongComponent';
import { v4 as uuidv4 } from 'uuid';
import NowPlaying from '@/components/nowplaying';
import Image from 'next/image';
import { CardanoWallet } from '@meshsdk/react';
import CoverArt from "@/components/coverArt"

interface SongData {
  id: string;
  data: Record<string, any>;
}

const Form: React.FC = () => {
  const [songsData, setSongsData] = useState<SongData[]>([{ id: uuidv4(), data: {} }]);
  const [legalName, setLegalName] = useState<string>('');
  const [releaseTitle, setReleaseTitle] = useState<string>('');
  const [trackCount, setTrackCount] = useState<number>(1);
  const [songMouse, setSongMouse] = useState<boolean>(false);
  const [coverArtImage, setCoverArtImage] = useState<File | null>(null);
  const [visibleSongId, setVisibleSongId] = useState<string | null>(null);

  useEffect(() => {
    const newSongsData = Array(trackCount).fill(null).map((_, index) => 
      songsData[index] || { id: uuidv4(), data: {} }
    );

    setSongsData(newSongsData);
  }, [trackCount]);

  const handleSongDataChange = (id: string, songData: Record<string, any>) => {
    const newSongsData = songsData.map(song =>
      song.id === id ? { ...song, data: songData } : song
    );
    setSongsData(newSongsData);
  };

  const handleTrackCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setTrackCount(count);
  };

  const handleSongMouseEnter = (id: string) => {
   if(!visibleSongId){ setVisibleSongId(id)};
   if(visibleSongId) {setVisibleSongId(null); setVisibleSongId(id)}
  
  };

  const handleCoverArtChange = (file: File) => {
    setCoverArtImage(file);
  };
  
  const handleSongMouseLeave = () => {
  if (visibleSongId) setVisibleSongId(null);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = {
      legalName,
      releaseTitle,
      songsData: songsData.map(song => song.data),
    };
    console.log('FormData JSON:', formData);
  };

  return (
    <div >
      <div className="h-24  bg-black max-w-[620px] rounded-2xl border-2 border-neutral-500 m-auto pb-2"><Image className="mt-4 mx-2 absolute" src="/radio.svg" height={60} width={60} alt="logo"></Image><h1 className="text-center m-auto ">Submit your Music</h1> <div className="w-fit m-auto"> <CardanoWallet isDark/></div></div>
      <NowPlaying />
    
      <div className="w-full rounded-2xl md:w-[750px] flex flex-col my-4 mx-auto border-2 border-neutral-400 text-white text-center bg-black/70">
        <form onSubmit={handleSubmit} className="form">
          <h1 className="formHead">Name:</h1>
          <h2 className="text-xs">Provide a name for the individual/entity submitting the release.</h2>
          <input
            className="formInputs"
            type="text"
            required
            title="Must be person/legal entity. Typically, this is the copyright owner or an entitled rights holder, but can also be a publisher or other party with powers of attorney over the works in question."
            placeholder="Legal Name"
            value={legalName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLegalName(e.target.value)}
          />
          <h1 className="formHead">Release Title:</h1>
          <h2 className="hidden md:block">Input a title for the release. This will appear as the token's name.</h2>
          <input
            className="formInputs"
            type="text"
            title="If the release is a collection, i.e. an album or compilation, list its name here. Otherwise, this will be the token's name."
            placeholder="Release/Album Name"
            value={releaseTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setReleaseTitle(e.target.value)}
          />
           <CoverArt onImageChange={(file: File) => handleCoverArtChange} />
          <div id="break"></div>
          <h1
            style={{ margin: "5px", color: "aqua", fontFamily: "russ", textShadow: "1px 0px red" }}
            className="text-sm md:text-base"
          >
            Song Info
          </h1>
          <div>
            <h4 className="text-white text-sm">No. of Songs</h4>
            <input 
              className="ml-2 w-16" 
              type="number"
              max="25"
              value={trackCount}
              onChange={handleTrackCountChange}
             
            />
          </div>
         
          <div 
        id="songed" 
        className="border-neutral-400 border-2"
        
      >
        {songsData.map((song, index) => (
          <div 
            key={song.id} 
            onClick={() => handleSongMouseEnter(song.id)}
            onDoubleClick={handleSongMouseLeave}
          >
            <SongComponent
              id={song.id}
              index={index}
              onSongDataChange={handleSongDataChange}
              songData={song.data}
              isVisible={visibleSongId === song.id}
            />
          
    </div>
  ))}
</div>
          <div id="smBreak"></div>
          <button className="text-amber-200 text-lg border-cyan-200 m-2 rounded-md border-2 sticky px-2" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;