import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <section className="flex flex-col h-[80svh] overflow-auto bg-black/70 p-2">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="items-center flex flex-col py-4 px-6  bg-black rounded-lg border-[1px] max-w-[36rem] text-sm border-zinc-500">
          Arp Radio is an interactive environment for music tokens minted on the Cardano blockchain. By organizing and indexing these musical works, users are provided means of interacting with a collection of listed songs via public and token-gated playlists, as well as discovering tokens within the ecosystem. 
          
          
          <div className="h-fit w-fit mx-auto bg-black rounded-xl mt-4 sticky ">
          <h1 className="text-md mb-2  text-sky-100 font-semibold px-2">Get ArpRadio token free every Epoch via DripDrips!</h1>
          <Link href="https://dripdropz.io/" target="_blank">
            <Image className="mx-auto" src="drip.svg" alt="post" width={100} height={100}/>
          </Link>  
        </div>
       <div className=" justify-evenly items-center hidden md:flex"> <Link href="https://x.com/ArpRadioweb3" target="_blank">
            <Image className="mx-auto mt-8 h-8 w-auto items-center" title="Arp Radio on Twitter/X" src="/x.jpg" alt="X" width={100} height={100}/>
          </Link>   <Link href="https://psyencelab.media" target="_blank">
          <div className="my-6 rounded-lg mx-auto text-center text-xs bg-black pt-2 px-2  border-[.1rem] border-zinc-500/50 ml-10 " title="Arp Radio is presented to you by The Psyence Lab">
            <h3 className="text-center">Brought to you by:</h3>
            <Image className="h-8 w-auto border-[1px] rounded-lg mx-auto border-zinc-400" src="/psyencelab.png" height={300} width={100} alt="Psyence Lab"/>
            <h1 className="mt-1 mb-2 p-2  text-amber-400">Production-Publishing-Distribution</h1>
          </div>
        </Link></div>
        <hr className="h-[1px] border-[1px] border-white mt-4 m-2 w-full"/>
        <h2 className="mt-2 text-xl mb-4 mx-4 font-extrabold font-mono text-sky-300">Music Projects on Cardano</h2>
        <div  className="flex justify-between items-center">
        <Link href="https://recordstore.newm.io/" target="_blank" title="The Record Store"><Image className="mx-4" src="/recordstore.png" width={100} height={100} alt="The Record Store" /></Link>
        <Link href="https://www.demu.pro/" target="_blank" title="Demu"><Image className="mx-4" src="/demu.svg" width={100} height={100} alt="Demu" /></Link>
        <Link href="https://newm.io/" target="_blank" title="Newm"><Image className="mx-4" src="/newm.png" width={100} height={100} alt="Newm" /></Link>
        <Link href="https://soundrig.io/" target="_blank" title="SoundRig"><Image className="mx-4" src="/soundrig.webp" width={100} height={100} alt="SoundRig" /></Link>
        </div> 
        <div   className="mt-4 flex items-center justify-between">
        <Link href="https://www.youtube.com/@solittyrecords" target="_blank" title="So Litty Records"><Image className="h-12 w-auto mx-4" src="/slr.png" width={100} height={100} alt="So Litty Records" /></Link>
        <Link href="https://sickcity.xyz" target="_blank" title="Sick City"><Image className="mx-4 h-auto w-24" src="/sick-city.webp" width={100} height={100} alt="Sick City" /></Link>
        <Link href="https://sync.land" target="_blank" title="SyncLand"><Image className="mx-4 h-auto w-14" src="/syncland.png" width={100} height={100} alt="SyncLand" /></Link>
        </div>     
        </div>
    
 
        
       
        
        
      </div>
    </section>
  );
}