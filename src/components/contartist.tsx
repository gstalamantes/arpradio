import React, { useState, ChangeEvent } from 'react';

interface ContributingArtist {
  name: string;
  ipn: string;
  roles: string[];
}

interface ContArtistsFormProps {
  onArtistsChange: (artists: { [name: string]: { ipn: string; roles: string[] } }) => void;
}

const ContArtistsForm: React.FC<ContArtistsFormProps> = ({ onArtistsChange }) => {
  const [artists, setArtists] = useState<ContributingArtist[]>([{ name: '', ipn: '', roles: [''] }]);

  const updateArtistsChange = (newArtists: ContributingArtist[]) => {
    const formattedArtists = newArtists.reduce((acc, artist) => {
      if (artist.name) {
        acc[artist.name] = { ipn: artist.ipn, roles: artist.roles };
      }
      return acc;
    }, {} as { [name: string]: { ipn: string; roles: string[] } });
    onArtistsChange(formattedArtists);
  };

  const handleArtistChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newArtists = artists.map((artist, i) => 
      i === index ? { ...artist, name: event.target.value } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const handleIpnChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newArtists = artists.map((artist, i) => 
      i === index ? { ...artist, ipn: event.target.value } : artist
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
    setArtists(prevArtists => {
      const newArtists = [...prevArtists, { name: '', ipn: '', roles: [''] }];
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
    <div className="formInputs">
      
        <h1 className="formHead">Contributing Artists:</h1>
        <h2 className="formDesc" title="Here you can list all artists that will be credited as a performing contributor to the song. In the case of a band, you can list the contributing members of the song here. If available, input the IPN of each performer. These artists will not be listed in the Artist field, but are credited and can be tracked in the metadata of the token.">
          List Contributing Artists along with their according IPN, if available.
        </h2>
        {artists.map((artist, artistIndex) => (
          
          <div key={artistIndex} className="mb-4">
            <div className="w-fit border-2 border-neutral-200 p-4 mx-auto rounded-xl bg-black/40">
            <div id="formFlex">
         
              <input
                type="text"
                value={artist.name}
                className="w-36"
                onChange={(event) => handleArtistChange(artistIndex, event)}
                placeholder="Performer's Name"
              />
              <input
                type="text"
                value={artist.ipn}
                className="w-32"
                onChange={(event) => handleIpnChange(artistIndex, event)}
                placeholder="IPN"
              />
            
            </div>
            <div className="w-fit mx-auto">
              <h2 className="formDesc">Roles:</h2>
              {artist.roles.map((role, roleIndex) => (
                <div key={roleIndex} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={role}
                    className="w-24 mr-2"
                    onChange={(e) => handleRoleChange(artistIndex, roleIndex, e.target.value)}
                    placeholder="Role"
                  />
                  {roleIndex > 0 && (
                    <button
                      className="border-2 p-1 bg-black/60 text-xs text-neutral-300 border-amber-400"
                      onClick={() => deleteRole(artistIndex, roleIndex)}
                    >
                      Delete Role
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
            {artistIndex > 0 && (
              <div className="flex"> 
              <button
                  className="w-24  border-2 p-1 my-2 mx-auto bg-black/60 text-xs text-neutral-300 border-amber-400"
                  onClick={() => deleteArtist(artistIndex)}
                >
                  Delete Artist
                </button></div>
              )}
          </div>
          </div>
        ))}
      
      <button
        className="border-2 p-1 m-1 bg-black/60 text-xs text-neutral-300 border-amber-400"
        onClick={addArtist}
      >
        Add Artist
      </button>
    </div>
  );
};

export default ContArtistsForm;