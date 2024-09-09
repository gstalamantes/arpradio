
import Image from "next/image";
import Link from "next/link";


export default async function Home() {

  return (
    <section className="flex flex-col h-[80svh] overflow-auto bg-black/50  p-2">
    
    <div className="h-fit w-fit mx-auto bg-black rounded-xl p-2 sticky border-[1px] border-zinc-500">
      <h1 className="text-xs mb-2">Get ArpRadio token free every Epoch via DripDrips!</h1>
            <Link  href="https://dripdropz.io/" target="_blank">
            <Image className="mx-auto" src="drip.svg" alt="post" width={100} height={100}/>
            </Link>  
            </div>
    <Link className="m-auto hidden md:block" data-lang="en" data-width="400" data-height="450" data-theme="dark" href="https://twitter.com/ArpRadioweb3?ref_src=twsrc%5Etfw">Tweets by ArpRadioweb3</Link> <script async src="https://platform.twitter.com/widgets.js" ></script>
    </section>
  );
}
