"use server";

import { BlockfrostProvider } from "@meshsdk/core";
import { MeshWallet } from "@meshsdk/core";

export const someAction = async () => {
  const APIKEY = process.env.BLOCKFROST_API!;
  const blockchainProvider = new BlockfrostProvider(APIKEY);

  const wallet = new MeshWallet({
    networkId: 1,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: "root",
      bech32: `${process.env.MESHWALLET_PRIVATE_KEY}`,
    },
  });

  const address = wallet.getChangeAddress();
  console.log(address);
};