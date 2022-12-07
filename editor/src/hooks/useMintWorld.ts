import { GraphJSON } from '@behave-graph/core';
import { useEffect, useState } from 'react';
import { usePrepareContractWrite, useContractWrite, useContractEvent } from 'wagmi';
import { abi } from '../contracts/abi';
import chainNodesToChainSpec from '../nodes/chain/chainNodesToChainSpec';
import { SafeMintInputs } from '../nodes/chain/IChainNode';

const toMintArgs = (cid: string, behaviorGraph: GraphJSON): SafeMintInputs => {
  // convert chain nodes to on chain node defininitions
  const { nodeDefinitions, edgeDefinitions } = chainNodesToChainSpec(behaviorGraph);

  const result: SafeMintInputs = [cid, nodeDefinitions, edgeDefinitions];

  return result;
};
const useWaitForMintedTokenWithContentUri = ({ contractAddress, cid }: { contractAddress: string; cid: string }) => {
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);

  useContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'SafeMint',
    listener(tokenId, to, uri, nodes) {
      // hack - if this was minted with the proper cid, we can assume this was the token.
      if (uri === cid) {
        setMintedTokenId(tokenId.toNumber());
      }
    },
  });

  return mintedTokenId;
};

const useMintWorld = ({
  worldCid,
  contractAddress,
  behaviorGraph,
}: {
  contractAddress: string;
  worldCid: string;
  behaviorGraph: GraphJSON;
}) => {
  const [args, setArgs] = useState(() => toMintArgs(worldCid, behaviorGraph));

  useEffect(() => {
    const args = toMintArgs(worldCid, behaviorGraph);
    setArgs(args);
  }, [worldCid, behaviorGraph]);

  const { config, error, isError } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: 'safeMint',
    args,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
  });

  const mintedTokenId = useWaitForMintedTokenWithContentUri({
    contractAddress,
    cid: worldCid,
  });

  return { mint: write, isSuccess, isLoading, isError, error, mintedTokenId };
};

export type MintWorldReturn = ReturnType<typeof useMintWorld>;

export default useMintWorld;
