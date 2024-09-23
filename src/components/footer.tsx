"use client"

import Link from "next/link";
import Controls from "./controls";
import { usePathname } from "next/navigation";
import { useMusic } from "../providers/songs";
import Art from "./art";

export default function Footer() {
    const pathname = usePathname();
    const { songs, index } = useMusic();
  
    const coverArt = songs[index]?.cover_art_url || "/default.png";
    const songName = songs[index]?.name || "No Song Selected";
    const artistName = songs[index]?.artist || "--"

    return (
        <section className="grid grid-cols-3 text-xs bg-black pt-1 pb-2 px-1 border-[1px] m-0 border-zinc-800 rounded-t-2xl">
            <div className="col-span-1 mt-2 flex justify-center text-center items-center">
                <div id='nowPlaying' className={pathname === "/radio" ? "hidden" : "content-center border-[1px] border-zinc-800 bg-white/5 rounded-xl mr-9 md:mr-0 text-zinc-300 max-w-[89px] w-fit text-center md:max-w-64 md:px-4 p-2"}>
                    <Link href="/radio">
                        <div className="flex mb-4 items-center">
                            <div className="hidden md:block">
                                <Art imageUrl={coverArt} height={80} width={80} />
                            </div>
                            <div className="text-center">
                                <h1 className="text-[.6rem] md:text-xs m-1">Now Playing:</h1>
                                <div className="m-1 text-amber-500 font-mono text-center md:text-sm text-[.5rem]">{songName}</div>
                                <div className="m-1 w-16 md:w-36 font-mono text-center text-[.5rem] md:text-sm">{artistName}</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            
            <div className="col-span-1 flex justify-center items-center">
                <Controls />
            </div>
            
            <div className="col-span-3 flex flex-col justify-end">
                <div className="flex justify-between pt-3 mx-4">
                    <Link className="text-blue-700" href="/terms" target="_blank">Terms</Link>
                    <Link href="https://psyencelab.media" className="text-zinc-500 text-xs" target="_blank">&copy; The Psyence Lab LLC</Link>
                </div>
            </div>
        </section>
    )
}