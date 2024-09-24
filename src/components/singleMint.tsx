"use client"

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import ArtistsForm from './artistIsni';
import ContArtistsForm, { FormattedContributingArtist } from './contartist';
import Featured from './feature';
import { useWallet } from '@meshsdk/react';
import { Mint, ForgeScript, AssetMetadata, Transaction, Integer } from '@meshsdk/core';
import { uploadToIpfs, pinFiles } from '../actions/ipfs';  

interface FormattedArtist {
  name: string;
  isni: string;
  Links: { [key: string]: string };
}

interface FormData {
  assetName: string;
  name: string;
  image: File | null;
  releaseName: string;
  songTitle: string;
  songFile: File | null;
  songDuration: string | null;
  artists: FormattedArtist[];
  featuredArtists: FormattedArtist[];
  contributingArtists: FormattedContributingArtist[];
  genre: string;
  subGenre?: string;
  subGenre2?: string;
  isrc?: string;
  iswc?: string;
  compCopyright: string;
  masterCopyright: string;
  quantity: number
}


function secondsToISO8601Duration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (remainingSeconds > 0) duration += `${remainingSeconds}S`;

  return duration;
}

function cleanObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter(v => v != null && v !== '' && (typeof v !== 'object' || Object.keys(v).length > 0));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedValue = cleanObject(value);
      if (cleanedValue != null && cleanedValue !== '' && (typeof cleanedValue !== 'object' || Object.keys(cleanedValue).length > 0)) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {} as any);
  }
  return obj;
}

export default function Single() {
  const { wallet, connected } = useWallet();
  const [formData, setFormData] = useState<FormData>({
    assetName: '',
    name: '',
    image: null,
    releaseName: '',
    songTitle: '',
    songFile: null,
    songDuration: null,
    artists: [],
    featuredArtists: [],
    contributingArtists: [],
    genre: 'Alternative',
    subGenre: '',
    subGenre2: '',
    isrc: '',
    iswc: '',
    compCopyright: '',
    masterCopyright: '',
    quantity: 1
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (formData.songFile) {
      const audioUrl = URL.createObjectURL(formData.songFile);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onloadedmetadata = () => {
          if (audioRef.current) {
            const durationInSeconds = audioRef.current.duration;
            const isoDuration = secondsToISO8601Duration(durationInSeconds);
            setFormData(prev => ({
              ...prev,
              songDuration: isoDuration
            }));
          }
        };
      }
      return () => URL.revokeObjectURL(audioUrl);
    }
  }, [formData.songFile]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'quantity' ? parseInt(value, 10) : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleArtistsChange = (artists: FormattedArtist[]) => {
    setFormData((prev) => ({ ...prev, artists }));
  };

  const handleFeaturedArtistsChange = (featuredArtists: FormattedArtist[]) => {
    setFormData((prev) => ({ ...prev, featuredArtists }));
  };

  const handleContributingArtistsChange = (contributingArtists: FormattedContributingArtist[]) => {
    setFormData((prev) => ({ ...prev, contributingArtists }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (connected) {
        const usedAddress = await wallet.getUsedAddresses();
        const address = usedAddress[0];

        const forgingScript = ForgeScript.withOneSignature(address);

        let imageCid = '';
        if (formData.image) {
          const imageFormData = new FormData();
          imageFormData.append('file', formData.image);
          const imageUploadResult = await uploadToIpfs(imageFormData);
          if (imageUploadResult.success) {
            imageCid = imageUploadResult.cid;
          } else {
            throw new Error('Failed to upload image to IPFS');
          }
        }

        let songCid = '';
        if (formData.songFile) {
          const songFormData = new FormData();
          songFormData.append('file', formData.songFile);
          const songUploadResult = await uploadToIpfs(songFormData);
          if (songUploadResult.success) {
            songCid = songUploadResult.cid;
          } else {
            throw new Error('Failed to upload song to IPFS');
          }
        }

        const rawAssetMetadata: AssetMetadata = {
          "name": formData.assetName,
          "image": `ipfs://${imageCid}`,
          "music_metadata_version": "3",
          "licensing": "For Promotional and Listening purposes only.",
          "agreement": "ipfs://",
          "release": {
            "release_type": "Single",
            "release_title": formData.releaseName,
            "distributor": "Arp Radio"
          },
          "files": [
            {
              "name": formData.songFile?.name,
              "mediaType": formData.songFile?.type,
              "src": `ipfs://${songCid}`,
              "song": {
                "song_title": formData.songTitle,
                "song_duration": formData.songDuration,
                "track_number": "1",
                "artists": formData.artists.map(artist => ({
                  name: artist.name,
                  isni: artist.isni,
                  Links: artist.Links
                })),
                "featured_artists": formData.featuredArtists.map(artist => ({
                  name: artist.name,
                  isni: artist.isni,
                  Links: artist.Links
                })),
                "contributing_artists": formData.contributingArtists,
                "genres": [formData.genre, formData.subGenre, formData.subGenre2],
                "copyright": {
                  "master": `℗ ${formData.masterCopyright}`,
                  "composition": `© ${formData.compCopyright}`
                },
                "isrc": formData.isrc,
                "iswc": formData.iswc
              }
            }
          ]
        };

        const cleanedAssetMetadata = cleanObject(rawAssetMetadata);

        const asset: Mint = {
          assetName: `ArpRadio-${formData.assetName}`,
          assetQuantity: `${formData.quantity}`,
          metadata: cleanedAssetMetadata,
          label: "721",
          recipient: address,
        };

        const tx = new Transaction({ initiator: wallet });
        tx.mintAsset(
          forgingScript,
          asset,
        );

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);

     const cidsToPin = [imageCid, songCid].filter(cid => cid !== '');
        const pinResult = await pinFiles(cidsToPin);

        if (pinResult.success) {
          alert(`Transaction submitted successfully. Hash: ${txHash}\nFiles pinned successfully.`);
        } else {
          alert(`Transaction submitted successfully. Hash: ${txHash}\nWarning: Failed to pin files. They may be removed from the IPFS network after some time.`);
        }

      } else {
        alert("Please connect your wallet");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction cancelled or failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black text-black rounded-xl border-zinc-500 border-[1px] p-2 w-full justify-center mx-auto h-full">
      <div className="max-h-[55dvh] w-full mx-auto overflow-y-auto">
        <div className="formInput">
          <label className="formLabel">*Asset Name:</label>
          <input className="inputForm" name="assetName" type="text" value={formData.assetName} onChange={handleInputChange} title="The Asset Name, along with the Policy ID, uniquely identifies a token." required />
        </div>
        <div className="formInput">
          <label className="formLabel">*Image: </label>
          <input className="inputForm" name="image" type="file" onChange={handleFileChange} accept="image/*" required />
        </div>
        <div className="formInput">
          <label className="formLabel">*Release Name: </label>
          <input className="inputForm" name="releaseName" type="text" value={formData.releaseName} onChange={handleInputChange} required />
        </div>
        <div className="formInput">
          <label className="formLabel">*Song Title: </label>
          <input className="inputForm" name="songTitle" type="text" value={formData.songTitle} onChange={handleInputChange} required />
        </div>
        <div className="formInput">
          <label className="formLabel">*Song File: </label>
          <input className="inputForm" name="songFile" type="file" onChange={handleFileChange} accept="audio/*" required />
        </div>
        <audio ref={audioRef} style={{ display: 'none' }} />
        
        <div className="formInput">
          <label className="formLabel">*Genre: </label>
          <select name="genre" className="formSelect" value={formData.genre} onChange={handleInputChange} required>
            <option className="formOption">Alternative</option>
            <option className="formOption">Avant-Garde/Experimental</option>
            <option className="formOption">Blues</option>
            <option className="formOption">Classical/Opera</option>
            <option className="formOption">Country</option>
            <option className="formOption">Easy Listening</option>
            <option className="formOption">Electronic</option>
            <option className="formOption">Folk</option>
            <option className="formOption">Hip-Hop/Rap</option>
            <option className="formOption">Jazz</option>
            <option className="formOption">Latin</option>
            <option className="formOption">Metal</option>
            <option className="formOption">Pop</option>
            <option className="formOption">Punk</option>
            <option className="formOption">R&B</option>
            <option className="formOption">Rock</option>
            <option className="formOption">World</option>
          </select>
        </div>
        <div className="formInput">
          <label className="formLabel">Sub-Genre: </label>
          <input className="inputForm" name="subGenre" type="text" value={formData.subGenre} onChange={handleInputChange} />
        </div>
        <div className="formInput">
          <label className="formLabel">Sub-Genre: </label>
          <input className="inputForm" name="subGenre2" type="text" value={formData.subGenre2} onChange={handleInputChange} />
        </div>
        <div className="formInput">
          <label className="formLabel">ISRC: </label>
          <input className="inputForm" name="isrc" type="text" value={formData.isrc} onChange={handleInputChange} />
        </div>
        <div className="formInput">
          <label className="formLabel">ISWC: </label>
          <input className="inputForm" name="iswc" type="text" value={formData.iswc} onChange={handleInputChange} />
        </div>
        <div className="formInput">
          <label className="formLabel">*Composition Copyright: </label>
          <input
            className="inputForm"
            name="compCopyright"
            type="text"
            value={formData.compCopyright}
            onChange={handleInputChange}
            placeholder="2024 Artist"
            title="© is automatically prepended to the input. Provide the Year and Copyright Holder"
            required
          />
        </div>
        <div className="formInput">
          <label className="formLabel">*Recording Copyright: </label>
          <input
            className="inputForm"
            name="masterCopyright"
            type="text"
            value={formData.masterCopyright}
            onChange={handleInputChange}
            placeholder="2024 Label/Artist"
            title="℗ is automatically prepended to the input. Provide the Year and Copyright Holder"
            required
          />
        </div>
        <div className="formInput">
  <label className="formLabel">Token Mint Quantity:</label>
  <input 
    className="inputForm w-[6rem] mx-auto"
    type="number" 
    name="quantity" 
    min="1" 
    value={formData.quantity} 
    onChange={handleInputChange}
    required
  />
</div>
        <ArtistsForm onArtistsChange={handleArtistsChange} />
        <Featured onArtistsChange={handleFeaturedArtistsChange} />
        <ContArtistsForm onArtistsChange={handleContributingArtistsChange} />
      </div>
      <button type="submit" className="items-center text-white rounded-full mt-1 mx-auto px-4 p-1 border-zinc-300 text-sm border-[1px]">
        Mint
      </button>
    </form>
  );
}