import React from "react";
import SongInfo from "@/components/songInfo";
import LikeButton from "@/components/likeButton";
import UpvoteButton from "@/components/upVote";

export default function Radio() {

  return (
    <section className="flex h-[80svh] items-center bg-black/40 justify-center text-center">
      <div className="border-[1px] border-zinc-700 max-h-[420px] h-fit w-[40dvh] max-w-[450px] bg-black rounded-2xl">
        <div id="radio" className="flex">
     <SongInfo/>
        </div>
        <div className="flex justify-evenly mx-auto mb-2"><LikeButton /> <UpvoteButton/></div>
      </div>
    </section>
  );
}