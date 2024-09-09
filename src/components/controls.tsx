"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, ChangeEvent, useRef, Suspense } from "react";
import { useMusic } from "../providers/songs";
import { useWallet } from "@meshsdk/react";
import Audio from "./audioFetch";

interface Asset {
  fingerprint: string;
  policyId: string;
  quantity: string;
}

export default function Controls() {
    const [shuffled, setShuffle] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const {songs, setSongs, index, setIndex} = useMusic();
    const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
    const [playlists, setPlaylists] = useState<Array<{value: string, text: string}>>([]);
    const { connected, wallet } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [playlistCompleted, setPlaylistCompleted] = useState(false);
    const audio = audioRef.current;

    const toggleShuffle = () => {
        setShuffle(prevState => !prevState);
    };
    
    const handlePlaylistChange = async (event: ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        setSelectedPlaylist(selected);
        setPlaylistCompleted(false);
        if (!selected) return;
        try {
           
            const response = await fetch(`/api/playlist?playlist=${encodeURIComponent(selected)}`);
    
            if (response.ok) {
                
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0 && data[0]?.url) {
                    audio?.pause();
                    setSongs(data);
                    setIndex(0);
                } else {
                    alert('No songs found.');
                
                    setSelectedPlaylist(selectedPlaylist);
                }
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const togglePlay = useCallback(() => {
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => {
                    console.error("Error playing audio:", error);
                    playNext();
                });
            }
        }
        if (!audio){alert("No Songs to Play...")}
    }, [isPlaying]);

    const changeSong = useCallback((newIndex: number) => {

        if (songs.length > 0) {
            setIsPlaying(false);
            setIsLoading(true);
            setIndex(newIndex);
        }
    }, [songs.length, setIndex]);

    const playNext = useCallback(() => {
        if (songs.length > 0) {
            
            if (shuffled) {
                audio?.pause()
                const nextIndex = Math.floor(Math.random() * songs.length);
                changeSong(nextIndex);
            } else {
                const nextIndex = index + 1;
                if (nextIndex < songs.length) {
                    audio?.pause()
                    changeSong(nextIndex);
                } else {
                    setIsPlaying(false);
                    setPlaylistCompleted(true);
                    alert("Playlist completed.");
                }
            }
        }
    }, [songs.length, index, shuffled, changeSong]);
    const playPrevious = useCallback(() => {
        if (index && index > 0) {
            audio?.pause();
            const prevIndex = shuffled
                ? Math.floor(Math.random() * songs.length)
                : (index - 1 + songs.length) % songs.length;
            changeSong(prevIndex);
        }
        if (index === 0){alert("First Song in Playlist.")}
    }, [songs.length, index, shuffled, changeSong]);

    const toggleVolumeSlider = useCallback(() => {
        setShowVolumeSlider(prevState => {
            const newState = !prevState;
            
            if (newState) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    setShowVolumeSlider(false);
                }, 2500);
            }
            
            return newState;
        });
    }, []);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    useEffect(() => {
        const audio = document.getElementById("audio") as HTMLAudioElement;
        if (audio) {
            audioRef.current = audio;
            audio.volume = volume;
            
            const handlePlay = () => {if(audio.src) {setIsPlaying(true)}};
            const handlePause = () => {if(audio.src) {setIsPlaying(false)}};
            const handleEnded = () => {
                if (playlistCompleted) {
                    setIsPlaying(false);
                } else {
                    playNext();
                }
            };
            const handleError = (event: ErrorEvent) => {
                console.error("Audio error:", event);
                if (!playlistCompleted) {
                    playNext();
                }
            };
            const handleCanPlay = () => setIsLoading(false);

            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('error', handleError);
            audio.addEventListener('canplay', handleCanPlay);

            return () => {
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('pause', handlePause);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('error', handleError);
                audio.removeEventListener('canplay', handleCanPlay);
            };
        }
    }, [volume, playNext, playlistCompleted]);

    const getAssets = useCallback(async () => {
        if (wallet) {
            try {
                const assets = await wallet.getAssets();
                const arpToken = "asset1l04ghdhrn5vx0v6rjm253fhuhrlvl96kp2eq87";
                const scToken = "asset1f43d6tx3seaf33vnhedxnqsllzpaq5wxvf9ar0";
                const scPolicy = "6ddd6503e0ab63538c77bd51f679b9ed84998af89901b01ce3dace88";
                const scPolicy2 = "123da5e4ef337161779c6729d2acd765f7a33a833b2a21a063ef65a5";
                const arpHolder = assets.find((asset: Asset) => asset.fingerprint === arpToken);
                const scHolder = assets.find((asset: Asset) => asset.fingerprint === scToken);
                const matchingAssets = assets.filter((asset: Asset) => asset.policyId === scPolicy || asset.policyId === scPolicy2);

                let newPlaylists = [
                    { value: '', text: 'Select a playlist' },
                    { value: 'top50', text: 'Top 50' },
                    { value: 'latest', text: 'Latest' }
                ];

                if (arpHolder && parseInt(arpHolder.quantity) > 1000) {
                    newPlaylists.push({ value: 'all', text: 'All' });
                }

                if (arpHolder && parseInt(arpHolder.quantity) > 100) {
                    const exclusivePlaylists = [
                        { value: 'afro-beat', text: 'Afro-Beat' },
                        { value: 'alt', text: 'Alternative' },
                        { value: 'blues', text: 'Blues' },
                        { value: 'classical', text: 'Classical' },
                        { value: 'dance', text: 'Dance' },
                        { value: 'electronic', text: 'Electronic' },
                        { value: 'folk', text: 'Folk/Americana' },
                        { value: 'funk', text: 'Funk' },
                        { value: 'hip hop', text: 'Hip Hop' },
                        { value: 'jazz', text: 'Jazz' },
                        { value: 'metal', text: 'Metal' },
                        { value: 'pop', text: 'Pop' },
                        { value: 'rock', text: 'Rock' },
                        { value: 'techno', text: 'Techno/Trance' },
                        { value: 'world', text: 'World' }
                    ];
                    newPlaylists = [...newPlaylists, ...exclusivePlaylists];
                }

                if (matchingAssets.length > 9 && scHolder && parseInt(scHolder.quantity) > 10000) {
                    newPlaylists.push({ value: 'sickcity', text: 'Sick City' });
                }

                setPlaylists(newPlaylists);
            } catch (error) {
                console.error("Error fetching assets:", error);
            }
        }
    }, [wallet]);

    useEffect(() => {
        if (connected) {
            getAssets();
        } else {
            setPlaylists([
                { value: '', text: 'Select a playlist' },
                { value: 'top50', text: 'Top 50' },
                { value: 'latest', text: 'Latest' }
            ]);
        }
    }, [connected, getAssets]);

    return (
        <div className="border-[1px] border-zinc-400 z-40 bg-zinc-500/70  col-span-1 w-56 rounded-lg my-1 pt-1 mx-auto">
            <Suspense fallback={"Loading"}>
                <Audio 
                    songUrl={songs[index]?.url || ''} 
                    onNext={playNext}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </Suspense>
            <div className="flex justify-evenly pb-2 ">
                <button className="cursor-pointer" onClick={playPrevious}>
                    <Image className="m-0 w-[40px] h-auto" src="/previous.svg" alt="Previous" width={100} height={100}/>
                </button> 
                <button id="play-pause" className="cursor-pointer" onClick={togglePlay}>
                    <Image className="m-0" src={isPlaying ? "/pause.svg" : "/play.svg"} alt={isPlaying ? "Pause" : "Play"} width={40} height={40}/>
                </button> 
                <button className="cursor-pointer"  onClick={playNext}>
                    <Image className="m-0" src="/next.svg" alt="Next" width={40} height={40}/>
                </button>
            </div>
            
            <div className="flex m-0 justify-evenly px-1">   
                <div onClick={toggleShuffle} title="Shuffle" className="cursor-pointer m-0">
                    <Image className="my-0" src={shuffled ? "/shuffled.svg" : "/shuffle.svg"} width={50} height={50} alt="Shuffle"/>
                </div>
                <select 
                    id="playlistSelect" 
                    className="text-center h-fit text-sm my-auto px-1 border-black border-[1px] text-black"
                    onChange={(event) => handlePlaylistChange(event)}
                    value={selectedPlaylist}
                >
                    {playlists.map((playlist, index) => (
                        <option key={index} value={playlist.value}>{playlist.text}</option>
                    ))}
                </select>
                <div className="relative">
                    <div id="volume" onMouseEnter={toggleVolumeSlider} className="cursor-pointer items-center mt-1 ml-2 text-2xl">
                        🔊
                    </div>
                    {showVolumeSlider && (
                        <div onMouseLeave={toggleVolumeSlider} className="bg-black/90 p-2 border-[1px] -mt-14 -ml-8 rounded-lg -rotate-90 absolute">
                            <div className="rotate-90 absolute -top-6 left-8 text-white text-xs">
                               <h2 className=" p-2 justify-end flex ml-24 -mt-12 bg-black rounded-full border-[1px] border-zinc-500">
                                 {Math.round(volume * 100)}%
                                </h2>
                            </div>
                            <input
                                onMouseLeave={toggleVolumeSlider}
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-24 h-4"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}