"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export const MeshProviderApp = ({ children }: { children: React.ReactNode }) => {
  const [MeshProviderState, setMeshProviderState] = useState<any | null>(null);
  useEffect(() => {
    const run = async () => {
        try {
            const { MeshProvider } = await import("@meshsdk/react");
            setMeshProviderState(() => MeshProvider);
          } catch (error) {
            console.error("Error importing MeshProvider:", error);
          }   
    };
    run();
  }, [setMeshProviderState]);

  if (MeshProviderState === null) {
  
    return <section className="w-full h-screen justify-center  "> 

      <div className="w-full absolute"><Image className="mx-auto p-4 h-64 " src="/radio.svg" width={150} height={150} alt="Arp Radio" /></div>
    <div className="flex flex-col items-center justify-center h-full">  
     <Image className="m-2" src="/album.gif" alt="Loading" width={150} height={150}></Image>
      <h1>Loading...</h1>
      </div>
     
      </section> 
  }
  return <MeshProviderState>{children}</MeshProviderState>;
};