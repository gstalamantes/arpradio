"use client";

import { useEffect, useState } from "react";

interface WalletProps {
  isDark?: boolean;
}

export const Wallet: React.FC<WalletProps> = ({ isDark }) => {
  const [WalletComponent, setWalletComponent] = useState<any | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const { CardanoWallet } = await import("@meshsdk/react");
        setWalletComponent(() => CardanoWallet);
      } catch (error) {
        console.error("Error importing CardanoWallet:", error);
      }
    };
    run();
  }, []);
  
  if (WalletComponent === null) {
    return <div>Loading...</div>
  }

  return <WalletComponent isDark={isDark} />;
};