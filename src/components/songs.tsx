
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Song {
  [key: string]: any;
}

interface SongsContextType {
  songs: Song[];
  setSongs: (songs: Song[]) => void;
}

const SongsContext = createContext<SongsContextType | undefined>(undefined);

interface SongsProviderProps {
  children: ReactNode; 
}

export const SongsProvider: React.FC<SongsProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);

  return (
    <SongsContext.Provider value={{ songs, setSongs }}>
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongsContext);
  if (context === undefined) {
    throw new Error('useSongs must be used within a SongsProvider');
  }
  return context;
};
