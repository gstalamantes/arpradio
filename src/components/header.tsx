"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Wallet } from "./wallet";
import { resolveEpochNo } from "@meshsdk/core";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/radio", label: "Radio" },
    { href: "/releases", label: "Releases" },
    { href: "/mint", label: "Mint" }
];

const epoch = resolveEpochNo('mainnet');

export default function Header() {
    const pathname = usePathname();
    return (
        <header className="p-2 md:gap-x-5 z-10 text-sm md:text-lg bg-sky-950 rounded-2xl border-2 border-zinc-500">
            <div className="flex w-full justify-between items-center">
                
                    <Link href="/">
                        <Image className="h-auto mt-4 mx-2 w-[60px] md:w-[82px]" height={50} width={50} src="/radio.svg" alt="Arp Radio" />
                    </Link>
                    <nav className="flex  -mt-8 justify-end">
                        <ul className="flex bg-black/20 p-1 px-4 rounded-lg gap-x-5 border-[1px] border-zinc-200">
                            {navLinks.map((link) => (
                                <li className="nav" key={link.href}>
                                    <Link 
                                        className={pathname === link.href ? "text-zinc-400 text-opacity-60 font-bold" : "text-zinc-300"} 
                                        href={link.href}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
            </div>     <div className="justify-center -mt-8 items-center">
                    <div className="w-fit mx-auto">
                        <Wallet isDark={true} />
                    </div>
                    <div className="font-mono text-center text-xs text-amber-400">
                        <Link href={`https://cexplorer.io/epoch/${epoch}`} target="_blank">Current Epoch: {epoch}</Link>
                    </div>
                </div>
        </header>
    );
}