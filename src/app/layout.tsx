import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "@/components/container";
import  {MeshProviderApp}  from "../providers/meshProvider";
import "@meshsdk/react/styles.css";
import { MusicProvider } from "../providers/songs";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arp Radio",
  description: "A web3 Music Player and tools for Independent Artists, provided by The Psyence Lab LLC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-zinc-300 min-h-dvh max-h-[100svh]`} >
      <MeshProviderApp>
        <MusicProvider>
      <Container>
      <Header/>
      {children}    
        <Footer/>
        </Container>
        </MusicProvider>
        </MeshProviderApp>
        </body>
    </html>
  );
}
