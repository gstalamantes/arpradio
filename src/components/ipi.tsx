import React, { useState, useCallback } from 'react';

interface Author {
  authorName: string;
  ipi: string;
}

interface IpiProps {
  onIpiChange: (newIpis: Author[]) => void;
}

const Ipi: React.FC<IpiProps> = ({ onIpiChange }) => {
  const [authors, setAuthors] = useState<Author[]>([{ authorName: '', ipi: '' }]);

  const updateParent = useCallback((newAuthors: Author[]) => {
    onIpiChange(newAuthors);
  }, [onIpiChange]);

  const handleChange = (index: number, field: keyof Author, value: string) => {
    setAuthors(prevAuthors => {
      const newAuthors = prevAuthors.map((author, i) => 
        i === index ? { ...author, [field]: value } : author
      );
      updateParent(newAuthors);
      return newAuthors;
    });
  };

  const addAuthor = () => {
    setAuthors(prevAuthors => {
      const newAuthors = [...prevAuthors, { authorName: '', ipi: '' }];
      updateParent(newAuthors);
      return newAuthors;
    });
  };

  const deleteAuthor = (index: number) => {
    setAuthors(prevAuthors => {
      const newAuthors = prevAuthors.filter((_, i) => i !== index);
      updateParent(newAuthors);
      return newAuthors;
    });
  };
  return (
    <div className="m-auto">
      <h1 className="formHead">Authors/Songwriters:</h1>
    
       
      {authors.map((author, index) => (
        <div key={index}>
          <input
            className="w-36"
            type="text"
            value={author.authorName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(index, 'authorName', event.target.value)}
            placeholder="Name"
          />
          <input
            title="An IPI identifies rights holders associated with the work in question. It is vital for reporting authorship to PROs and other royalty collection mechanisms."
            className="w-28"
            type="text"
            value={author.ipi}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(index, 'ipi', event.target.value)}
            placeholder="IPI"
          />
          <button 
            className="border-2 p-1 m-1 bg-black/60 text-xs text-neutral-300 border-amber-400" 
            onClick={() => deleteAuthor(index)}
          >
            Delete
          </button>
        </div>
      ))}
      <button 
        className="border-2 p-1 m-2 bg-black/60 text-xs text-neutral-300 border-amber-400" 
        onClick={addAuthor}
      >
        Add Author
      </button>
    </div>
  );
};

export default Ipi;