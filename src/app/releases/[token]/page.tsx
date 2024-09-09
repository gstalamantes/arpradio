import Image from "next/image"
import Link
 from "next/link";
export default function Token({ params }: {params: {token: string}}) {
  return (
    <section className=" text-center h-[80svh] justify-center flex items-center p-4">
     <h1 className="font-bold text-xl md:text-2xl">{params.token}</h1>
     <div className="mx-auto">
      <Image className="mx-auto my-4" src={`/${params.token}`} height={100} width={100} alt={`${params.token} Image`}></Image>
      <Link href={`https://cexplorer.io/asset/${params.token}`} target="_blank"><h2>Policy ID: {params.token}</h2></Link>
      <h2> Artist:</h2>
      <div className="cursor-pointer my-4 mx-auto rounded-2xl w-fit px-4 border-[1px] border-zinc-700" >Buy</div>
      </div>


    </section>
  );
}
