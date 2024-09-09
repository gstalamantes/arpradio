"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Wallet } from "./wallet";
import {resolveEpochNo} from "@meshsdk/core";

const navLinks = [
    {
        href: "/",
        label: "Home"
    },
    {
        href: "/radio",
        label: "Radio"
    },
    {
        href: "/releases",
        label: "Releases"
    },
    {
        href: "/mint",
        label: "Mint"
    }
]

const epoch = resolveEpochNo('mainnet');

export default function Header() {
   const pathname= usePathname();
    return (
        <header className=" px-2 md:gap-x-5 z-10 grid-cols-3 text-sm md:text-lg bg-sky-950 rounded-2xl border-2 border-zinc-500">
            <div className="flex justify-between items-center">
                <Link href="/">
                    <Image  className="h-auto mx-2 absolute md:-mt-4 md:mx-2 w-[60px] md:w-[90px]" height={50} width={50} src={"/radio.svg"} alt="Arp Radio">
                    </Image>
                </Link>
           
                <nav className="flex m-2 justify-between">

                    <ul className="flex bg-black/20 py-1 px-4 rounded-full gap-x-5 border-[1px] border-zinc-200">
                        {
                            navLinks.map((link) =>
                                <li className="nav" key={link.href}>
                                    <Link className={pathname=== link.href ? "text-zinc-400 text-opacity-60 font-bold" : "text-zinc-300"} href={link.href}>{link.label}</Link>
                                </li>
                            )
                        }
                    </ul>
                </nav>
            </div>
            <div className="mx-auto mb-2 w-fit"> 
                <Wallet isDark={true}/>
            </div>
            <div className="flex font-mono -mt-1 ml-auto justify-between w-fit text-xs pb-1 mr-1 text-amber-400">
               <Link href={`https://cexplorer.io/epoch/${epoch}`} target="_blank">Current Epoch: {epoch}</Link>
            </div>
        </header> 
    )
}