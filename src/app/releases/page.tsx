import { Suspense } from 'react';
import SearchableResults from '@/components/searchResults';
import Image from 'next/image';


export default function Releases({ searchParams }: { searchParams: { search?: string; arpOnly?: string } }) {
  const { search, arpOnly } = searchParams;
  const arpOnlyBool = arpOnly === 'on';

  return (
    <section className="h-[80svh] text-center justify-center flex items-center bg-black/40">
      <div className="h-[55dvh] bg-black/80 rounded-xl border-[1px] border-zinc-600 mx-4 my-auto w-full">
        <h1 className="m-4">CIP-60 Music Token Repository</h1>
        <Suspense fallback={<div><Image src="" width={100} height={100} alt="Arp"/></div>}>
          <SearchableResults search={search} arpOnly={arpOnlyBool} />
        </Suspense>
      </div>
    </section>
  );
}