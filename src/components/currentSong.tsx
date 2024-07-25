import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IndexContextType {
  index: number;
  setIndex: (index: number) => void;
}

const IndexContext = createContext<IndexContextType | undefined>(undefined);

export const useIndex = () => {
  const context = useContext(IndexContext);
  if (!context) {
    throw new Error('useIndex must be used within an IndexProvider');
  }
  return context;
};

interface IndexProviderProps {
  children: ReactNode;
}

export const IndexProvider = ({ children }: IndexProviderProps) => {
  const [index, setIndex] = useState(0);

  return (
    <IndexContext.Provider value={{ index, setIndex }}>
      {children}
    </IndexContext.Provider>
  );
};
