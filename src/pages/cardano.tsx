import Link from "next/link";
import Image from "next/image";
import NowPlaying from "@/components/nowplaying";

export default function Cardano (){

    return(
        <div>
            <NowPlaying/>
        <div className="m-auto text-center">
            
            <h3></h3>
            
             <h1 className="text-xl bg-black/70 py-2 border-2 border-neutral-700" >Music on Cardano</h1>
             
             <div className="affiliates">
                <div className="block float-right">
<Link href="https://www.demu.pro/" target="_blank"> <Image className="my-4" src="/demu.svg" width={200} height={200}alt="DEMU" ></Image></Link>
<Link href="https://newm.io/" target="_blank"> <Image  className="my-4" src="/newm.png" width={200} height={200}alt="NEWM" ></Image></Link>
<Link href="https://www.soundrig.io/" target="_blank"> <Image className="my-4" src="/soundrig.webp" width={200} height={200}alt="SoundRig" ></Image></Link></div>
<div className="block float-left">
<Link href="https://sickcity.xyz/" target="_blank"> <Image className="my-4" src="/sickcity.png" width={200} height={200}alt="Sick City" ></Image></Link>
<Link href="https://recordstore.newm.io/" target="_blank"> <Image  className="my-4" src="/recordstore.png" width={250} height={250}alt="The Record Store" ></Image></Link>
</div>

</div>

       </div></div>
    )
}