import { NavLinks } from "./navlinks";
import Link from "next/link";
import Image from "next/image";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import React, { useState, useEffect, useCallback } from "react";
import { resolveEpochNo } from '@meshsdk/core';


export function Nav() {
  const [loading, setLoading] = useState<boolean>(false);
  const { connected, wallet, disconnect } = useWallet();
  const epoch = resolveEpochNo('mainnet');
  const getAssets = useCallback(async () => {
    if (wallet) {
        setLoading(true);
        try {
            const assets = await wallet.getAssets();
            const arpToken = "asset1l04ghdhrn5vx0v6rjm253fhuhrlvl96kp2eq87";
            const scToken = "asset1f43d6tx3seaf33vnhedxnqsllzpaq5wxvf9ar0";
            const scPolicy = "6ddd6503e0ab63538c77bd51f679b9ed84998af89901b01ce3dace88";
            const scPolicy2 = "123da5e4ef337161779c6729d2acd765f7a33a833b2a21a063ef65a5";
            const voteElements = document.querySelectorAll('[id="voteNav"]') as NodeListOf<HTMLElement>;
            const arpHolder = assets.find((asset: any) => asset.fingerprint === arpToken);
            const scHolder = assets.find((asset: any) => asset.fingerprint === scToken);
            const matchingAssets = assets.filter(asset => asset.policyId === scPolicy || asset.policyId === scPolicy2);
            const selectElement = document.getElementById('playlist');
            if (arpHolder && arpHolder.quantity > 1000) {
                const optionAll = document.createElement('option');
                optionAll.value = 'all';
                optionAll.text = 'All';
                if (selectElement) selectElement.appendChild(optionAll);
            }
            if (arpHolder && arpHolder.quantity > 100) {
                const selectElement = document.getElementById('playlist');

                const optionsData = [
                    { value: 'afro-beat', text: 'Afro-Beat', className:"exclusive"},
                    { value: 'alt', text: 'Alternative', className:"exclusive"},
                    { value: 'blues', text: 'Blues', className:"exclusive" },
                    { value: 'classical', text: 'Classical', className:"exclusive"},
                    { value: 'dance', text: 'Dance', className:"exclusive"},                       
                    { value: 'electronic', text: 'Electronic', className:"exclusive" },
                    { value: 'folk', text: 'Folk/Americana', className:"exclusive" },
                    { value: 'funk', text: 'Funk', className:"exclusive" },
                    { value: 'hip hop', text: 'Hip Hop', className:"exclusive"},
                    { value: 'jazz', text: 'Jazz', className:"exclusive" },
                    { value: 'metal', text: 'Metal', className:"exclusive" },
                    { value: 'pop', text: 'Pop', className:"exclusive" },
                    { value: 'rock', text: 'Rock', className:"exclusive" },
                    { value: 'techno', text: 'Techno/Trance', className:"exclusive" },
                    { value: 'world', text: 'World', className:"exclusive" },
                ];
            
                optionsData.forEach(optionInfo => {
                    const option = document.createElement('option');
                    option.value = optionInfo.value;
                    option.text = optionInfo.text;
                    if (selectElement) selectElement.appendChild(option);
                });
            }
            
            if (arpHolder && arpHolder.quantity > 10) {
                voteElements.forEach(element => {
                    element.style.display = 'block';
                });
         
            }
            if (matchingAssets.length > 9 && scHolder && scHolder.quantity > 10000) {
             if (selectElement) {
const option = document.createElement('option');
option.value = "sickcity";
option.text = "Sick City";
option.className = "exclusive"
selectElement.appendChild(option);
}

            }
        } catch (error) {
            console.error("Error fetching assets:", error);
        } finally {
            setLoading(false);
        }
    }
}, [wallet]);

useEffect(() => {

  if (connected) {
    getAssets();
  } 
}, [connected, getAssets]);

return (
    <div className="w-full">
        <nav id="nav" className="bg-black/80 border-2 p-1 border-neutral-600 relative lg:max-w-7xl w-full flex md:grid md:grid-cols-3 items-center  mx-auto rounded-xl py-3">
            <div className="mx-auto">
              <Link href="/">  <Image className=" mx-auto p-4" src="/radio.svg" alt="Arp Radio" height={100} width={100} id="arpIcon"/></Link>
               <h1 id="web3" className="text-center text-amber-200 text-sm font-900">web3 Music Player</h1>
                </div>
            <NavLinks />
            
            <div id="wallet" className="m-auto  ">
            <Link href="https://cexplorer.io/epoch/" target="_blank"> <div className=" text-center text-xs mx-auto mb-4">Current Epoch: {epoch}</div></Link>
                 <div className="text-center mb-4">
                
                <CardanoWallet onConnected={() => {}} isDark label="Wallet" /></div>
                <Link className="md:hidden underline  text-2xs w-36 text-amber-200" href="https://flint-wallet.app.link/browse?dappUrl=https%3A%2F%2Farpradio.media">Access wallet on mobile using Flint.</Link> 
            </div>
    
            <div id="navlinks" className="text-center m-auto text-cyan-400 py-1 bg-neutral-800   px-4 md:px-8  rounded md:hidden border-2">
                <ul>
                <Link href="/about"><li>About</li></Link>
                <Link href="/"> <li>Radio</li></Link>
                <Link href="/wallet"><li>Wallet</li></Link>
               <Link href="/form"><li>Mint</li></Link>
                </ul>
               
            </div>
                    
   
        </nav>
<div className="fixed bottom-0 index-10 z-10 text-xs m-1 bg-black/70 rounded-md text-neutral-400  justify-between  px-4 py-1">  
<span className="m-2"><Link href="">Terms </Link></span>
<span className="m-2"><Link href="https://dripdropz.io" target="_blank">Drip Arp </Link></span>
<span className="m-2"><Link href="">Contact</Link></span>
<span className="m-2"><Link href="/cardano">Affiliates</Link></span>
 </div>
        </div>
   
  );
}
