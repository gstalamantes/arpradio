import Single from "@/components/singleMint";

export default function Mint(){

    return(
<section className="flex h-[80svh] items-center bg-black/70 justify-center text-center">
<div className="mx-auto "><h1 className="text-center pb-2">Create a Token</h1>
<h3 className="text-xs">* Denotates a required field.</h3>
   <Single/>
</div>

</section>

    )
}