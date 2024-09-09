export default async function Home() {

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };


  return (
    <section className="h-[80svh] text-center justify-center flex items-center bg-black/40 ">
     
<div className="overflow-y-auto h-[60dvh] bg-black/80 rounded-xl border-[1px] border-zinc-600 mx-4 my-auto w-full">
<h1 className=" m-4">Music Token Repository</h1>
<div className="flex justify-evenly text-xs w-fit ml-auto mr-2 ">
  <label className="text-md font-bold">Filter:</label>
<label className=" text-[.4rem] md:text-xs ">Artist</label><input className="text-black w-28 m-1" type="text"/>
<label className=" text-[.4rem] md:text-xs ">Genre</label><input className="text-black w-24 m-1" type="text"/>
<button className="border-[1px] my-1 px-2  border-zinc-400">Go</button>
</div>
<hr/>
</div>



    </section>
  );
}
 