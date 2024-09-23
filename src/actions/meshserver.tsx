"use server";

import { BlockfrostProvider } from "@meshsdk/core";
import { MeshWallet, ForgeScript, Transaction, Mint, AssetMetadata } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";

export async function mint(formData: FormData) {
  const { wallet } = useWallet();
  const APIKEY = process.env.BLOCKFROST_API!;
  const privKey = process.env.MESHWALLET_PRIVATE_KEY;
  const blockchainProvider = new BlockfrostProvider(`${APIKEY}`);

  const mintingWallet = new MeshWallet({
    networkId: 1,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: "root",
      bech32: `${privKey}`,
    },
  });

  const forgingScript = ForgeScript.withOneSignature(
    mintingWallet.getChangeAddress(),
  );
  
  const usedAddress = await wallet.getUsedAddresses();
  const address = usedAddress[0];
  
  const asset: Mint = {
    assetName: "MeshToken",
    assetQuantity: "1",
    metadata: `demoAssetMetadata`,
    label: "721",
    recipient: address,
  };
  
  const tx = new Transaction({ initiator: wallet });
  tx.mintAsset(forgingScript, asset);
  
  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, true);
  const signedTx2 = await mintingWallet.signTx(signedTx, true);
  const txHash = await wallet.submitTx(signedTx2);
}