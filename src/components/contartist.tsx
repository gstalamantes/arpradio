"use client"

import React, { useState, ChangeEvent } from 'react';

interface ContributingArtist {
  name: string;
  identifier: string;
  identifierType: 'IPN' | 'IPI';
  roles: string[];
}

export interface FormattedContributingArtist {
  name: string;
  roles: string[];
  ipn?: string;
  ipi?: string;
}

interface ContArtistsFormProps {
  onArtistsChange: (artists: FormattedContributingArtist[]) => void;
}

const ContArtistsForm: React.FC<ContArtistsFormProps> = ({ onArtistsChange }) => {
  const [artists, setArtists] = useState<ContributingArtist[]>([]);

  const updateArtistsChange = (newArtists: ContributingArtist[]) => {
    const formattedArtists = newArtists.map(artist => {
      const formattedArtist: FormattedContributingArtist = {
        name: artist.name,
        roles: artist.roles,
        [artist.identifierType.toLowerCase()]: artist.identifier
      };
      return formattedArtist;
    });
    onArtistsChange(formattedArtists);
  };

  const handleArtistChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newArtists = artists.map((artist, i) => 
      i === index ? { ...artist, name: event.target.value } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const handleIdentifierChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newArtists = artists.map((artist, i) => 
      i === index ? { ...artist, identifier: event.target.value } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const handleIdentifierTypeChange = (index: number, event: ChangeEvent<HTMLSelectElement>) => {
    const newArtists = artists.map((artist, i) => 
      i === index ? { ...artist, identifierType: event.target.value as 'IPN' | 'IPI' } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const handleRoleChange = (artistIndex: number, roleIndex: number, value: string) => {
    const newArtists = artists.map((artist, i) => 
      i === artistIndex ? {
        ...artist,
        roles: artist.roles.map((role, j) => 
          j === roleIndex ? value : role
        )
      } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const addArtist = () => {
    const newArtist: ContributingArtist = { name: '', identifier: '', identifierType: 'IPN', roles: [''] };
    setArtists(prevArtists => {
      const newArtists = [...prevArtists, newArtist];
      updateArtistsChange(newArtists);
      return newArtists;
    });
  };

  const deleteArtist = (index: number) => {
    setArtists(prevArtists => {
      const newArtists = prevArtists.filter((_, i) => i !== index);
      updateArtistsChange(newArtists);
      return newArtists;
    });
  };

  const addRole = (artistIndex: number) => {
    const newArtists = artists.map((artist, i) => 
      i === artistIndex ? { ...artist, roles: [...artist.roles, ''] } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const deleteRole = (artistIndex: number, roleIndex: number) => {
    const newArtists = artists.map((artist, i) => 
      i === artistIndex ? { ...artist, roles: artist.roles.filter((_, j) => j !== roleIndex) } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  return (
    <div className="text-zinc-300 mb-4 w-full">
      <h1>Contributing Artists:</h1>
      <h2 className="font-mono text-sm text-zinc-500" title="Here you can list all artists that will be credited as a performing contributor to the song. In the case of a band, you can list the contributing members of the song here. If available, input the IPN or IPI of each performer. These artists will not be listed in the Artist field, but are credited and can be tracked in the metadata of the token.">
        List Contributing Artists along with their according IPN or IPI, if available.
      </h2>
      {artists.map((artist, artistIndex) => (
        <div key={artistIndex} className="mb-4">
          <div className="w-full border-2 border-neutral-200 p-4 mx-auto rounded-xl bg-black/40">
            <input
              type="text"
              value={artist.name}
              className="w-56 text-black"
              onChange={(event) => handleArtistChange(artistIndex, event)}
              placeholder="Performer's Name"
            />
            <div id="formFlex">
              <select
                value={artist.identifierType}
                onChange={(event) => handleIdentifierTypeChange(artistIndex, event)}
                className="text-black mx-2"
              >
                <option value="IPN">IPN</option>
                <option value="IPI">IPI</option>
              </select>
              <input
                type="text"
                value={artist.identifier}
                className="w-32 text-black"
                onChange={(event) => handleIdentifierChange(artistIndex, event)}
                placeholder={artist.identifierType}
              />
            </div>
            <div className="w-fit mx-auto">
              <h2 className="formDesc">Roles:</h2>
              {artist.roles.map((role, roleIndex) => (
                <div key={roleIndex} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={role}
                    className="w-36 text-black mr-2"
                    onChange={(e) => handleRoleChange(artistIndex, roleIndex, e.target.value)}
                    placeholder="Role"
                  />
                  {roleIndex > 0 && (
                    <button
                      className="border-2 p-1 bg-black/60 text-xs text-neutral-300 border-amber-400"
                      onClick={() => deleteRole(artistIndex, roleIndex)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              <button
                className="border-2 p-1 mt-2 bg-black/60 mx-auto text-xs text-neutral-300 border-amber-400"
                onClick={() => addRole(artistIndex)}
              >
                Add Role
              </button>
            </div>
            <div className="flex"> 
              <button
                className="w-24 border-2 p-1 my-2 mx-auto bg-black/60 text-xs text-neutral-300 border-amber-400"
                onClick={() => deleteArtist(artistIndex)}
              >
                Delete Artist
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        className="border-2 p-1 m-1 bg-black/60 text-xs text-neutral-300 border-amber-400"
        onClick={addArtist}
      >
        Add Contributor
      </button>
    </div>
  );

};

export default ContArtistsForm;