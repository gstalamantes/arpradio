import React, { useState, ChangeEvent } from 'react';


interface ArtistLink {
  name: string;
  url: string;
}

interface FeaturedArtist {
  name: string;
  isni: string;
  links: ArtistLink[];
}

interface FormattedFeaturedArtist {
  name: string;
  isni: string;
  Links: { [key: string]: string };
}

interface FeaturedProps {
  onArtistsChange: (artists: FormattedFeaturedArtist[]) => void;
}

const Featured: React.FC<FeaturedProps> = ({ onArtistsChange }) => {
  const [artists, setArtists] = useState<FeaturedArtist[]>([]);

  const updateArtistsChange = (newArtists: FeaturedArtist[]) => {
    const formattedArtists = newArtists.filter(artist => artist.name).map(artist => ({
      name: artist.name,
      isni: artist.isni,
      Links: artist.links.reduce((acc, link) => {
        if (link.name && link.url) {
          acc[link.name] = link.url;
        }
        return acc;
      }, {} as { [key: string]: string })
    }));
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
    <div className="mb-4 text-zinc-300">
      <h1>Featured Artist:</h1>
      <h2 className="font-mono text-zinc-500 text-sm" title="Featured Artists are typically displayed along with the Artist in most players. Input any artist features here">
        Add the featured artist here.
      </h2>
      {artists.map((artist, artistIndex) => (
        <div key={artistIndex} className="w-full border-2 border-neutral-200 p-4 mx-auto rounded-xl bg-black/40">
          <div id="formFlex">
            <input
              type="text"
              value={artist.name}
              className="text-black w-48"
              onChange={(event) => handleArtistChange(artistIndex, event)}
              placeholder="Artist's Name"
            />
            <input
              type="text"
              value={artist.isni}
              className="w-36 text-black"
              onChange={(event) => handleIsniChange(artistIndex, event)}
              placeholder="ISNI"
            />
          </div>
          {artist.links.length > 0 && (
            <div className="p-4 mx-auto w-fit text-center">
              <h1 className="mx-auto">Links:</h1>
              {artist.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={link.name}
                    className="w-36 text-black mr-2"
                    onChange={(e) => handleLinkChange(artistIndex, linkIndex, 'name', e.target.value)}
                    placeholder="Link Name"
                  />
                  <input
                    type="url"
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
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            className="border-2 p-1 mb-2 mx-auto bg-black/60 text-xs text-neutral-300 border-amber-400"
            type="button"
            onClick={() => addLink(artistIndex)}
          >
            Add Link
          </button>
          <br/>
          <button 
            className="border-2 p-1 mt-4 bg-black/60 text-xs text-neutral-300 border-amber-400" 
            onClick={() => deleteArtist(artistIndex)}
          >
            Delete Artist
          </button>
        </div>
      ))}
      <button 
        className="border-2 p-1 m-1 bg-black/60 text-xs text-neutral-300 border-amber-400" 
        onClick={addArtist}
      >
        Add Feature
      </button>
    </div>
  );
};

export default Featured;