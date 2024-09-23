import React from 'react';
import Image from 'next/image';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <Image src="/album.gif" width={100} height={100} alt="Loading..."></Image>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-zinc-300"></div>
    </div>
  );
};

export default Loading;