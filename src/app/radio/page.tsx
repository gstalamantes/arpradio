import React from "react";
import PlayerButtons from "@/components/likeButton";
import SongInfo from "@/components/songInfo";

export default function Home() {

  return (
    <section className="flex h-[80svh] items-center bg-black/40 justify-center text-center">
      <div className="border-[1px] border-zinc-700 max-h-[500px] h-fit w-[40dvh] max-w-[450px] bg-black rounded-2xl">
        <div id="radio" className="flex">
     <SongInfo/>
        </div>
        <div className="flex my-4"><PlayerButtons /></div>
      </div>
    </section>
  );
}