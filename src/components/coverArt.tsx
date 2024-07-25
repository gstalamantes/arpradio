import React, { useState, ChangeEvent } from 'react';

interface CoverArtProps {
  onImageChange: (file: File) => void;
}

const CoverArt: React.FC<CoverArtProps> = ({ onImageChange }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    onImageChange(file);
  };

  return (
    <div className="formInputs">
      <h1 className="formHead">Cover Art:</h1>
      <h2 className="formDesc">
        Upload an image file for the release.
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="formInputs"
        style={{
          color: 'white',
          background: 'darkblue',
          borderRadius: '4px',
          justifyContent: 'center',
          outline: 'outset 1px silver',
          border: 'inset 1px gold',
          padding: '5px',
        }}
      />
    </div>
  );
};

export default CoverArt;
