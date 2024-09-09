"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Song {
  [key: string]: any;
}

interface MusicContextType {
  index: number;
  setIndex: (index: number) => void;
  songs: Song[];
  setSongs: (songs: Song[]) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [index, setIndex] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);

  return (
    <MusicContext.Provider value={{ index, setIndex, songs, setSongs }}>
      {children}
    </MusicContext.Provider>
  );
};