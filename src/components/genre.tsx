import { useState, ChangeEvent } from 'react';

export interface GenreData {
  genres: string[];
  mood: string;
}

interface GenreProps {
  onGenreChange: (genreData: GenreData) => void;
}

const Genre: React.FC<GenreProps> = ({ onGenreChange }) => {
  const [genres, setGenres] = useState<string[]>(['', '', '']);
  const [mood, setMood] = useState<string>('');
  const genreOptions = ['Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'Folk', 'Blues', 'Alternative', 'World'];

  const handleGenreChange = (index: number, event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newGenres = [...genres];
    newGenres[index] = event.target.value;
    setGenres(newGenres);
    onGenreChange({ genres: newGenres, mood });
  };

  const handleMoodChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMood = event.target.value;
    setMood(newMood);
    onGenreChange({ genres, mood: newMood });
  };

  return (
    <div className="formInputs">
      <h1 className="formHead">Genres:</h1>
      <h2 className="formDesc">
        Specify up to three genres that best classify the song.
      </h2>
      <div key={0}>
        <select
          value={genres[0]}
          onChange={(event) => handleGenreChange(0, event)}
          className="text-black"
        >
          <option value="" disabled>Select genre</option>
          {genreOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      {genres.slice(1).map((genre, index) => (
        <div key={index + 1}>
          <input
            type="text"
            value={genre}
            onChange={(event) => handleGenreChange(index + 1, event)}
            placeholder="Enter Sub-genre"
            className="formInputs"
          />
        </div>
      ))}
      <input
        type="text"
        placeholder="Mood"
        className="formInputs"
        value={mood}
        onChange={handleMoodChange}
      />
    </div>
  );
};

export default Genre;