"use client"

import { useState } from "react";
import { useWallet } from "@meshsdk/react";
import { Transaction } from "@meshsdk/core";
import { useMusic } from "../providers/songs"; 

interface Asset {
    fingerprint: string;
    policyId: string;
    quantity: string; 
}

export default function PlayerButtons() {
    const [liked, setLiked] = useState(false);
    const { connected, wallet } = useWallet();
    const { songs, index } = useMusic(); 
    const currentSong = songs[index] || {};
    const id = currentSong.song_id || null;
    const songName = currentSong.name || null;
    const artistName = currentSong.artist || null;

    const upvote = async () => {
        try {
            if (!connected ) {
                alert("Connect Wallet to Vote.");
                return;
            }

            const assets = await wallet.getAssets();
            const arpToken = "asset1l04ghdhrn5vx0v6rjm253fhuhrlvl96kp2eq87";
            const arpHolder = assets.find((asset: Asset) => asset.fingerprint === arpToken);
            
            if (!arpHolder || parseInt(arpHolder.quantity) <= 10) {
                alert("You need to hold at least 10 ARP tokens to vote.");
                return; 
}
            if (!artistName){alert("Select a Song to upvote.")}

            else {
            const tx = new Transaction({ initiator: wallet });
            tx.setMetadata(674, { msg: ['Arp Radio Upvote Song', `ID: ${id}`, `Song: ${songName}`, ` Artist: ${artistName}`] });
            tx.sendAssets(
                { address: 'addr1qydv3tm0dlk5660lpv98s4lhyrt260c0wk4ffkz53qf9l2c4sef3l3tqr80mcrqqlchxs49fvtv53eflp5ltdqnvxvcsjclj9p' },
                [{
                    unit: '6a40b1763f0c0490d94e17741ff6b39071688002a33f8991f361cacb415250',
                    quantity: '10',
                }]
            );
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);
            alert(`Transaction Successful! Hash:${txHash}`);
        }} catch (error) {
            console.error("Error during upvote:", error);
            alert("Transaction rejected.");
        }
    };

    const like = () => {
        setLiked(prevLiked => !prevLiked);
    };

    return (
        <div className="flex justify-between w-64 mx-auto px-6 mt-auto">
            <div>
                <button onClick={upvote} className="text-xs">
                    <div className="text-xl" title="Vote the song up in the playlist with on-chain voting.">👍</div>
                    Upvote
                </button>
            </div>
            <div>
                <button className="text-xs" onClick={like}>
                    <div title="Save this song in your favorites." className={liked ? "text-red-500 text-xl" : "text-xl text-opacity-20 text-white"}>❤</div>
                    Like
                </button>
            </div>
        </div>
    );
}