"use client"

import React, { useState, FormEvent, ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Mint() {
    const [selectedOption, setSelectedOption] = useState<string>("single")
    const router = useRouter()

    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        switch (selectedOption) {
            case "single":
                router.push("/mint/single")
                break
            case "album":
                router.push("/mint/album")
                break
            case "multiple":
                router.push("/mint/multiple")
                break
            default:
                break
        }
    }

    return (
        <section className="text-center h-[80svh] justify-center bg-black/60 items-center p-4">
            <h1>Mint a Token</h1>
            <h2 className="text-sm my-8">
                Mints will be sent to the connected wallet. By minting through this platform, 
                you agree to all <Link className="text-sky-700" href="/terms" target="_top">Terms and Conditions</Link>.
            </h2>
            <form onSubmit={handleSubmit} className="items-center p-12">
                <label className="text-sm mt-4">Select a Release Type:</label>
                <select 
                    className="text-black m-2 text-center"
                    value={selectedOption}
                    onChange={handleOptionChange}
                >
                    <option value="single" title="Select this option for single song submissions.">Single</option>
                    <option value="album" title="Select this option if the token is a single artist Album or EP.">Album/EP</option>
                    <option value="multiple" title="Select this option if the token includes multiple songs of various artists.">Multiple/Compilation</option>
                </select>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Continue
                </button>
            </form>
        </section>
    )
}