import NowPlaying from "@/components/nowplaying"

export default function About() {

    return(
        <div>
        <NowPlaying/>
        <div className="w-full">
            
            <h1 className="m-auto rounded-xl my-2 text-center text-xl bg-black/75 w-[580px] m-auto p-4 border-2">Why does Arp even exist?</h1>
        <h2 className="text-center text-lg ">The Music Industry as it Stands...</h2>
      <div className='about'> 

           <p> Today, as the technology changes, we have new ways of interacting with the world, and in turn has provided
            us better means of publishing our musical works.  Utilizing blockchain to store an immutable yet verifiable 
            record of songs as tokens has quickly been adopted by the pioneers of the space.  With ideas of creating a new 
            paradigm, many artists are convinced this will be the future of music.
            </p>
<p>
            Using an open and distributed system is not without its challenges; how the tokens are minted, what they 
            represent, and what they offer can change between each token.  As such, creating and utilizing standards
            is essential to ensuring a low friction environment for growth.

        </p>

<p>
After watching the developments in this new system, it is quite clear creating a new paradigm is not an over-night endeavor.
The result of years of token minting has proved to create even more siloed communities, putting more responsibility on the fans and thus creating friction.
And without an elegant solution to play these media tokens, it is no wonder why there is a sense of stagnation. 
</p>

<p>Arp Radio seeks to bridge some of the issues presented forth.  While open standards have been created,
    it is up to the author of the token to follow the standards.  Failure to do so can deem a token incompatible for
    certain uses.  Arp assists the minting process to ensure tokens will remain compatible on existing standards,
    simplifying the minting process.  And if that wasn't enough, Arp holders can mint their tokens free: just pay the 
    transaction fee.
</p>

<p>Arp Radio gamifies the playlists by allowing users to vote on the order of the songs.  The Top 50
    and Latest playlists are publicly accessible by anyone, while additional playlists and features are unlocked with Arp's 
    token ArpRadio.  The 10% of the token supply lives on Dripdropz, where it is claimable every epoch via chain-wide distribution- any staked 
    wallet is eligible.
</p>

        </div>
        </div></div>
    )
}