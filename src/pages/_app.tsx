import "@/styles/globals.css";
import { MeshProvider } from "@meshsdk/react";
import type { AppProps } from "next/app";
import { Nav } from "@/components/nav";
import { Controls } from "@/components/controls";
import { SongsProvider } from '../components/songs';
import { IndexProvider } from "@/components/currentSong";
import Modal from "react-modal";
import { Terms } from "@/components/terms";
import { useState } from "react";
import { useRouter } from 'next/router'; // Add this import

export default function App({ Component, pageProps }: AppProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter(); // Add this line

  function close() { setShowModal(false); }
  function terms() { setShowModal(true); }

  return (
    <div className="flex flex-col min-h-screen antialiased">
      <MeshProvider>
        <SongsProvider>
          <IndexProvider>
          {router.pathname !== '/form' &&   <Nav />}
            <Component {...pageProps} />
            {router.pathname !== '/form' && <Controls />} 
          </IndexProvider>
        </SongsProvider>
        <Modal className="bg-black/70" shouldCloseOnOverlayClick={true} isOpen={showModal}>
          <button className="fixed" onClick={close}>Close Terms</button>
          <Terms />
        </Modal>
      </MeshProvider>
    </div>
  );
}