import { useState, useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { resolveRewardAddress } from '@meshsdk/core';
import NowPlaying from "@/components/nowplaying";

const Home: NextPage = () => {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState<null | any[]>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wasConnected, setWasConnected] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<null | any>(null);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set());
  const [policyIds, setPolicyIds] = useState<Set<string>>(new Set());
  const [showAllAssets, setShowAllAssets] = useState<boolean>(false);

  useEffect(() => {
   
    fetch('/music_policies.json')
      .then(response => response.json())
      .then((data: { policyid: string }[]) => {
        const policies = new Set<string>(data.map((item: { policyid: string }) => item.policyid));
        setPolicyIds(policies);
      })
      .catch(error => console.error("Failed to fetch policy IDs:", error));
  }, []);

  const toHex = (str: string) => Buffer.from(str, 'utf8').toString('hex');

  useEffect(() => {
    if (connected) {
      setWasConnected(true);
      getAssets();
    } else if (wasConnected && !connected) {
      setAssets(null);
      setMatchData(null);
    }
  }, [connected, wasConnected]);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      try {
        const addresses = await wallet.getUsedAddresses();
        const rewardAddress = resolveRewardAddress(addresses[0]);
        console.log(rewardAddress);
        const _assets = await wallet.getAssets();
        setAssets(_assets);
      } catch (error) {
        console.error("Failed to fetch assets or match data:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const togglePolicy = (policyId: string) => {
    setExpandedPolicies(prev => {
      const newSet = new Set<string>(prev);
      if (newSet.has(policyId)) {
        newSet.delete(policyId);
      } else {
        newSet.add(policyId);
      }
      return newSet;
    });
  };

  const filteredAssets = assets?.filter((asset: any) => policyIds.has(asset.policyId));
  const assetsToDisplay = showAllAssets ? assets : filteredAssets;

  const groupedAssets = assetsToDisplay?.reduce((acc: any, asset: any) => {
    if (!acc[asset.policyId]) {
      acc[asset.policyId] = [];
    }
    acc[asset.policyId].push(asset);
    return acc;
  }, {});

  return (
    <div>
    <NowPlaying/>
    <div className=" p-2 text-center">
      <h1>Select an Asset</h1>
      
      {connected ? (
        <div className="w-full text-center max-h-[500px] md:max-h-3/4 overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {filteredAssets?.length === 0 && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex bottom-0 mx-auto"
                  onClick={() => setShowAllAssets(true)}
                >
                  No CIP-60 assets found. Click to show all assets.
                </button>
              )}
              {assetsToDisplay && (
                <table className="m-auto bg-cyan-900 rounded-2xl border-2 md:w-[600px] border-neutral-600">
                  <thead className="sticky top-0 bg-blue">
                    <tr>
                      <th className="bg-blue text-black border-2 rounded border-neutral-300">Sorted by Policy</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {groupedAssets && Object.keys(groupedAssets).flatMap((policyId: string) => {
                      const rows = [
                        <tr onClick={() => togglePolicy(policyId)} className="cursor-pointer text-center m-auto mb-10 mx-2 w-full" key={policyId}>
                          <td className=" m-auto ">
                            <span className="text-[7pt] text-amber-500 ml-2"># of Tokens:<span className="text-blue-400 text-[12pt]">{groupedAssets[policyId].length}</span></span>
                            <span className="text-[8pt] ml-2">{policyId.slice(0, 16)}... <span className="ml-2 text-blue-400 "> ({groupedAssets[policyId][0].assetName.slice(0,8)}, ...)</span></span>
                          </td>
                        </tr>
                      ];

                      if (expandedPolicies.has(policyId)) {
                        rows.push(...groupedAssets[policyId].map((asset: any, index: number) => (
                          <tr key={`${policyId}-${index}`} className="bg-blue-500 mb-10">
                            <td className="pl-4"><Link href={`https://pool.pm/${asset.fingerprint}`} target="_blank">{asset.assetName}</Link></td>
                          </tr>
                        )));
                      }

                      return rows;
                    })}
                  </tbody>
                </table>
              )}
              {matchData && (
                <div>
                  <h2>Match Data</h2>
                  <pre>{JSON.stringify(matchData, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 text-center mt-4">
          <p className="text-red-500 text-xl m-auto">Connect your wallet to view assets.</p>
        </div>
      )}
    </div></div>
  );
};

export default Home;
