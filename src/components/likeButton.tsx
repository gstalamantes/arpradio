"use client"

import React, { useState, useEffect, useCallback, memo } from "react";
import { useWallet } from "@meshsdk/react";
import { useMusic } from "../providers/songs"; 
import { resolveRewardAddress } from "@meshsdk/core-csl";
import { like, fetchLikes } from "@/actions/like";

interface FetchLikesResult {
    success: boolean;
    likes?: string[];
    error?: string;
}

const LikeButton: React.FC = () => {
    const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { connected, wallet } = useWallet();
    const { songs, index } = useMusic(); 
    const currentSong = songs[index] || {};
    const id = currentSong.song_id || null;
    const songName = currentSong.name || null;

    const fetchUserLikes = useCallback(async () => {
        if (connected && wallet) {
            try {
                const address = await wallet.getChangeAddress();
                const stake = resolveRewardAddress(address);
                const result: FetchLikesResult = await fetchLikes(stake);
                if (result.success && result.likes) {
                    setLikedSongs(new Set(result.likes));
                }
            } catch (error) {
                console.error("Error fetching likes:", error);
            } finally {
                setIsInitialLoading(false);
            }
        } else {
            setLikedSongs(new Set());
            setIsInitialLoading(false);
        }
    }, [connected, wallet]);

    useEffect(() => {
        setIsInitialLoading(true);
        fetchUserLikes();
    }, [connected, fetchUserLikes]);
;

    const handleLike = async () => {
        if (connected && songName && id) {
            setIsLoading(true);
            try {
                const address = await wallet.getChangeAddress();
                const stake = resolveRewardAddress(address);
           
                const result = await like(id.toString(), stake);
                
                if (result.success) {
                    setLikedSongs(prev => {
                        const newSet = new Set(prev);
                        if (result.action === 'liked') {
                            newSet.add(id);
                        } else {
                            newSet.delete(id);
                        }
                        return newSet;
                    });
                } else {
                    throw new Error(result.error || 'Unknown error occurred');
                }
            } catch (error) {
                console.error("Error toggling like:", error);
                alert("Failed to update like status. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else if (!connected) {
            alert("Connect your wallet to favorite songs.");
        } else if (!songName) {
            alert("No song to favorite.");
        }
    };
    
    const LikeButtonInner = memo(function LikeButtonInner() {
        if (isInitialLoading) {
            return <div className="text-xs">Loading...</div>;
        }

        const isLiked = id ? likedSongs.has(id) : false;

        return (
            <button className="text-xs" onClick={handleLike} disabled={isLoading}>
                <div 
                    title="Save this song in your favorites." 
                    className={isLiked ? "text-red-500 text-xl" : "text-xl text-opacity-20 text-white"}
                >
                    {isLoading ? '...' : '❤'}
                </div>
                {isLiked ? 'Unlike' : 'Like'}
            </button>
        );
    });

    return (
        <div>
            <div>
                <LikeButtonInner key={`${id}-${likedSongs.has(id || '')}-${isInitialLoading}`} />
            </div>
        </div>
    );
}

export default LikeButton;