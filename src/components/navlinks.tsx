import Link from "next/link"

export const navLinks = [
    {id: 0, name: "About", href:"/about"},
    {id: 2, name: "Vote", href:"/vote"},
    {id: 3, name: "Radio", href:"/"},
    {id: 4, name: "Wallet", href:"/wallet"}
]

export function NavLinks(){
    return (
        <div className="hidden md:flex justify-center mx-auto w-fit rounded-md bg-blue-950 md:gap-x-3 lg:gap-x-6 md:border-2 lg:border-2 px-3 text-cyan-400 lg:text-xl" id="link">
           {navLinks.map((item) => (
                <Link href={item.href} key={item.id}>
                    {item.name}
                </Link>
           ))}
           <a href="/form" target="_blank" rel="noopener noreferrer">
                Submit
           </a>
        </div>
    )
}