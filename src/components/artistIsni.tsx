import React, { useState, ChangeEvent } from 'react';

interface ArtistLink {
  name: string;
  url: string;
}

interface Artist {
  name: string;
  isni: string;
  links: ArtistLink[];
}

interface ArtistsFormProps {
  onArtistsChange: (artists: { [name: string]: { isni: string; links: ArtistLink[] } }) => void;
}

const ArtistsForm: React.FC<ArtistsFormProps> = ({ onArtistsChange }) => {
  const [artists, setArtists] = useState<Artist[]>([{ name: '', isni: '', links: [] }]);

  const updateArtistsChange = (newArtists: Artist[]) => {
    const formattedArtists = newArtists.reduce((acc, artist) => {
      if (artist.name) {
        acc[artist.name] = { isni: artist.isni, links: artist.links };
      }
      return acc;
    }, {} as { [name: string]: { isni: string; links: ArtistLink[] } });
    onArtistsChange(formattedArtists);
  };

  const handleArtistChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newArtists = artists.map((artist, i) => 
      i === index ? { ...artist, name: event.target.value } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const handleIsniChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newArtists = artists.map((artist, i) => 
      i === index ? { ...artist, isni: event.target.value } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const handleLinkChange = (artistIndex: number, linkIndex: number, field: 'name' | 'url', value: string) => {
    const newArtists = artists.map((artist, i) => 
      i === artistIndex ? {
        ...artist,
        links: artist.links.map((link, j) => 
          j === linkIndex ? { ...link, [field]: value } : link
        )
      } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const addArtist = () => {
    const newArtists = [...artists, { name: '', isni: '', links: [] }];
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const deleteArtist = (index: number) => {
    const newArtists = artists.filter((_, i) => i !== index);
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const addLink = (artistIndex: number) => {
    const newArtists = artists.map((artist, i) => 
      i === artistIndex ? { ...artist, links: [...artist.links, { name: '', url: '' }] } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  const deleteLink = (artistIndex: number, linkIndex: number) => {
    const newArtists = artists.map((artist, i) => 
      i === artistIndex ? { ...artist, links: artist.links.filter((_, j) => j !== linkIndex) } : artist
    );
    setArtists(newArtists);
    updateArtistsChange(newArtists);
  };

  return (
    <div className="formInputs">
      <h1 className="formHead">Artists:</h1>
      <h2 className="formDesc" title="This in most cases will be a single entity, like a band or songwriter/performer. For proper record keeping, multiple values are accepted, but should be kept minimal. Band members and contributors can be credited in the Contributing Artist field.">
        Add the primary Artist here and artist's ISNI, if available, to avoid name conflicts.
      </h2>
      {artists.map((artist, artistIndex) => (
        <div key={artistIndex} className="my-3">
          <div className="w-fit border-2 border-neutral-200 p-4 mx-auto rounded-xl bg-black/40">
            <div id="formFlex">
            
              <input
                type="text"
                value={artist.name}
                className="w-48"
                onChange={(event) => handleArtistChange(artistIndex, event)}
                placeholder="Artist's Name"
              />
              <input
                type="text"
                value={artist.isni}
                className="w-36"
                onChange={(event) => handleIsniChange(artistIndex, event)}
                placeholder="ISNI"
              />
         
            </div>
            <div className="w-fit mx-auto">
              <h1 className="formHead">Web Links:</h1>
              {artist.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={link.name}
                    className="w-36 mr-2"
                    onChange={(e) => handleLinkChange(artistIndex, linkIndex, 'name', e.target.value)}
                    placeholder="Link Name"
                  />
                  <input
                    type="text"
                    value={link.url}
                    className="w-48 mr-2"
                    onChange={(e) => handleLinkChange(artistIndex, linkIndex, 'url', e.target.value)}
                    placeholder="URL"
                  />
                  <button
                    className="border-2 p-1 bg-black/60 text-xs text-neutral-300 border-amber-400"
                    type="button"
                    onClick={() => deleteLink(artistIndex, linkIndex)}
                  >
                    Delete Link
                  </button>
                </div>
              ))}
              <button
                className="border-2 p-1 mt-2 bg-black/60 text-xs text-neutral-300 border-amber-400"
                type="button"
                onClick={() => addLink(artistIndex)}
              >
                Add Link
              </button>
            </div>
            {artistIndex > 0 && (
                <button
                  className="block bottom-0 w-24 border-2 p-1 mt-4 bg-black/60 mx-auto text-xs text-neutral-300 border-amber-400"
                  type="button"
                  onClick={() => deleteArtist(artistIndex)}
                >
                  Delete Artist
                </button>
              )}
          </div>
        </div>
      ))}
      <button
        className="border-2 p-1 bg-black/60 text-xs text-neutral-300 border-amber-400"
        type="button"
        onClick={addArtist}
      >
        Add Artist
      </button>
    </div>
  );
};

export default ArtistsForm;