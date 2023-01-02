import { GraphJSON } from '@behave-graph/core';
import { useEffect, useState } from 'react';
import { usePrepareContractWrite, useContractWrite, useContractEvent, useContractRead } from 'wagmi';
import { abi } from '@blocktopia/core';
import { SafeMintInputs, SocketIndecesByNodeType, generateOnChainNodesFromGraph } from '@blocktopia/core';

/** Generates arguments to mint a world.  Converts the graph definition to on-chain nodes and edges. */
const toMintArgs = ({
  cid,
  behaviorGraph,
  socketIndecesByNodeType,
}: {
  cid: string;
  behaviorGraph: GraphJSON;
  socketIndecesByNodeType: SocketIndecesByNodeType | undefined;
}): SafeMintInputs => {
  // convert chain nodes to on chain node defininitions
  if (!socketIndecesByNodeType) return [cid, [], []];
  const { nodeDefinitions, edgeDefinitions } = generateOnChainNodesFromGraph({
    graph: behaviorGraph,
    socketIndecesByNodeType,
  });

  const [result, setResult] = useState<SafeMintInputs>([cid, nodeDefinitions, edgeDefinitions]);

  // catch the results by storing them in a state variable.
  useEffect(() => {
    setResult([cid, nodeDefinitions, edgeDefinitions]);
  }, [cid, behaviorGraph, socketIndecesByNodeType]);

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
  const {
    data: socketIndecesByNodeType,
    error: readError,
    isLoading: readIsLoading,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'getSocketIndecesByNodeType',
  });

  const [args, setArgs] = useState(() =>
    toMintArgs({
      cid: worldCid,
      behaviorGraph,
      socketIndecesByNodeType,
    })
  );

  useEffect(() => {
    const args = toMintArgs({
      cid: worldCid,
      behaviorGraph,
      socketIndecesByNodeType,
    });
    setArgs(args);
  }, [worldCid, behaviorGraph, socketIndecesByNodeType]);

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
