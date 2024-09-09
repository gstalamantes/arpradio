import Link from "next/link";
import Multiple from "@/components/multiMint";

export default function Mint() {

    return(
    
        <section className=" text-center h-[80svh] justify-center bg-black/60 items-center">
            <h1>Mint a Token</h1>
            <h2 className="text-sm">Mints will be sent to the connected wallet.  By minting through this platform, you agree to all <Link className="text-sky-700" href="/terms" target="_top">Terms and Conditions</Link>.</h2>
                <div className="items-center">
                        <Multiple/>
                </div>
        </section>
    )
}