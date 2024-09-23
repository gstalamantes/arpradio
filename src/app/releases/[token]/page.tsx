import { getMetadata } from "@/utils/getMetadata";
import Link from "next/link";
import Art from "@/components/art";

export default async function Token({ params, searchParams }: { params: { token: string }, searchParams: { policy_id: string, name: string } }) {
  const { policy_id, name } = searchParams;
  const { imageUrl, name: metadataName, artists, releaseTitle, releaseType, songTitles, genres, producer, releaseInfo } = await getMetadata(policy_id, name);
  if (policy_id && name) {
    console.log(`Image: ${imageUrl}`)
    return (
      <section className="flex flex-col h-[80svh] items-center bg-black/80 justify-center text-center">
        <h1 className="font-bold text-xl mt-4 mb-1 md:text-2xl">{releaseTitle || songTitles}</h1>
   
        <Link href={`https://cexplorer.io/asset/${params.token}/metadata#data`} target="_blank">
            {imageUrl ? (
              <Art imageUrl={imageUrl} width={200} height={200} />
            ) : (
              <Art imageUrl="/album.gif" width={200} height={200} />
            )}
            <h2 className="text-xs text-zinc-400 mb-2">Policy ID: {policy_id}</h2>
        </Link>
        <div className="max-h-[45dvh] h-fit flex flex-col overflow-y-auto w-full items-center">
          <div className="w-full overflow-y-auto h-[40dvh]">
            <h2 className="mb-2">Release Type: {releaseType}</h2>
            {artists && artists.length > 0 && (
              <div className="text-base">
                <p>Artists:</p>
                {artists.map((artist, index) => (
                  <span key={index} className="m-2">
                    <span className="text-amber-400">{artist.name}</span>
                    {Object.keys(artist.links).length > 0 && (
                      <ul className="list-none text-sm">
                        {Object.entries(artist.links).map(([key, value]) => (
                          <li key={key}>
                            <a href={typeof value === 'string' ? value : value[0]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              {key}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </span>
                ))}
              </div>
            )}
            {producer && <p className="text-sm mt-2">Producer: {producer}</p>}

            {genres && (
              <p className="text-sm mt-2">
                Genres: {Array.isArray(genres) ? genres.join(", ") : genres}
              </p>
            )}
            
            {songTitles && songTitles.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold">Song Titles:</h3>
                <ul className="list-disc list-inside">
                  {songTitles.map((title, index) => (
                    <li key={index} className="text-sm">{title}</li>
                  ))}
                </ul>
              </div>
            )}

            {Object.keys(releaseInfo.links).length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold">Release Links:</h3>
                <ul className="list-none">
                  {Object.entries(releaseInfo.links).map(([key, value]) => (
                    <li key={key} className="text-sm">
                      {Array.isArray(value) ? (
                        <>
                          {key}:
                          <ul className="list-none pl-4">
                            {value.map((link, index) => (
                              <li key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                  {`${key} ${index + 1}`}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {key}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <Link href="/releases">
          <div className="cursor-pointer my-4 mx-auto font-bold rounded-2xl w-fit bg-black px-4 border-[1px] border-amber-400">
            Back
          </div>
        </Link>
      </section>
    );
  } else {
    return (
      <section className="h-[80svh] justify-center text-center bg-black/40 flex flex-col items-center p-4">
        <h1 className="font-bold text-xl text-zinc-300 md:text-2xl">Not Found or invalid Token.</h1>
      </section>
    );
  }
}