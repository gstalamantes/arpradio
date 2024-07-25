import React, { useState, useEffect, useCallback } from 'react';
import ContArtistsForm from './contartist';
import ArtistsForm from './artistIsni';
import Genre, { GenreData } from './genre';
import AudioInput from './songinput';
import Featured from './feature';
import Ipi from './ipi';

interface SongData {
  songTitle?: string;
  audioFile?: File;
  artists?: { [name: string]: { isni: string; links: ArtistLink[] } };
  featured?: { [name: string]: { isni: string; links: ArtistLink[] } };
  contArtists?: { [name: string]: { ipn: string; roles: string[] } };
  genres?: string[];
  mood?: string;
  explicit?: boolean;
  copyrightYear?: string;
  copyrightOwner?: string;
  rec_copyrightYear?: string;
  rec_copyrightOwner?: string;
  publication_date?: string;
  isrc?: string;
  iswc?: string;
  authors?: Author[];
}

interface ArtistLink {
  name: string;
  url: string;
}

interface Author {
  authorName: string;
  ipi: string;
}

interface SongComponentProps {
  id: string;
  index: number;
  onSongDataChange: (id: string, data: SongData) => void;
  songData?: SongData;
  isVisible: boolean;
}

const SongComponent: React.FC<SongComponentProps> = ({ id, index, onSongDataChange, songData, isVisible }) => {
  const [localSongData, setLocalSongData] = useState<SongData>(songData || {});

  const backgroundColors = ['rgb(255,60,60, .25)', 'rgb(60,255,60, .25)', 'rgb(60,60,255, .25)'];
  const backgroundColor = backgroundColors[index % backgroundColors.length];

  useEffect(() => {
    
    if (JSON.stringify(localSongData) !== JSON.stringify(songData)) {
      onSongDataChange(id, localSongData);
    }
  }, [localSongData, id, onSongDataChange, songData]);

  const handleChange = useCallback((field: keyof SongData, value: any) => {
    setLocalSongData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  const track = index + 1;

  return (
    <div style={{ backgroundColor, outline: "outset 2px silver" }} className="m-0 md:m-auto">
      <div className="sticky top-2">
        <div id='sngbtn' className="flex left-2 top-2" >
          <div className="border-2 text-bold text-blue-800 px-1 sticky mx-2 bg-amber-200">Track: {track}</div>
        </div>
      </div>

      <h1>Song Title:</h1>
      <input
        className="m-2"
        type="text"
        placeholder="Song Name"
        value={localSongData.songTitle || ''}
        onChange={(e) => handleChange('songTitle', e.target.value)}
      />

      <div style={{ display: isVisible ? 'block' : 'none' }}>
        <AudioInput onAudioChange={(file: File) => handleChange('audioFile', file)} />
        <ArtistsForm onArtistsChange={(newArtists: { [name: string]: { isni: string; links: ArtistLink[] } }) => {
  handleChange('artists', Object.keys(newArtists));
}} />
        <Featured onArtistsChange={(newFeatured: { [name: string]: { isni: string; links: ArtistLink[] } }) => {
  handleChange('featured', Object.keys(newFeatured));
}} />
      <ContArtistsForm onArtistsChange={(newContArtists: { [name: string]: { ipn: string; roles: string[] } }) => {
  handleChange('contArtists', Object.keys(newContArtists));
}} />
        <Genre onGenreChange={(genreData: GenreData) => {
          handleChange('genres', genreData.genres);
          handleChange('mood', genreData.mood);
        }} />
        <h1></h1>
        <h2 className="formDesc">If the work contains profane content, click here.</h2>
        <input
          type="checkbox"
          id="explicit"
          name="explicit"
          checked={localSongData.explicit || false}
          onChange={() => handleChange('explicit', !localSongData.explicit)}
          className="checkbox"
        />    <h1></h1>
        <h2 className="formDesc">If the work contains AI-generated content, click here.</h2>
       
        <h1>Copyright:</h1>
        <h2 className="formDesc">Composition</h2>
        <div id="formFlex">
          <input
            className="formInputs"
            type="number"
            id="cpYear"
            min="1900" max="2099" step="1"
            placeholder="Year"
            value={localSongData.copyrightYear || ''}
            onChange={(e) => handleChange('copyrightYear', e.target.value)}
          />
          <input
            className="formInputs"
            type="text"
            id="cpAppl"
            placeholder="Copyright Owner"
            value={localSongData.copyrightOwner || ''}
            onChange={(e) => handleChange('copyrightOwner', e.target.value)}
            required
          />
         <h2 className="formDesc">Master Recording</h2>
              <input
            className="formInputs"
            type="number"
            id="cpYear"
            min="1900" max="2099" step="1"
            placeholder="Year"
            value={localSongData.rec_copyrightYear || ''}
            onChange={(e) => handleChange('rec_copyrightYear', e.target.value)}
          />
          <input
            className="formInputs"
            type="text"
            id="cpAppl"
            placeholder="Copyright Owner"
            value={localSongData.rec_copyrightOwner || ''}
            onChange={(e) => handleChange('rec_copyrightOwner', e.target.value)}
            required
          />
        </div>
        <h1>Publication Date:</h1>
        <h2 className="formDesc">Provide the date the song was published/available to the public.</h2>
        <input
          className="formInputs"
          type="date"
          value={localSongData.publication_date || ''}
          onChange={(e) => handleChange('publication_date', e.target.value)}
        />
        <h1>ISRC:</h1>
        <h2 className="formDesc">Provide the song&apos;s ISRC code, if available</h2>
        <input
          className="formInputs"
          type="text"
          placeholder="xx-xxxx-xx-xxxxx"
          value={localSongData.isrc || ''}
          onChange={(e) => handleChange('isrc', e.target.value)}
        />
        <h1>ISWC:</h1>
        <h2 className="formDesc">Provide the song&apos;s ISWC code, if available</h2>
        <input
          className="formInputs"
          type="text"
          placeholder="T-xxxxxxxxx-X"
          value={localSongData.iswc || ''}
          onChange={(e) => handleChange('iswc', e.target.value)}
        />
         <Ipi 
        onIpiChange={(newIpis: Author[]) => handleChange('authors', newIpis)}
      />
      </div>
    </div>
  );
};

export default SongComponent;
