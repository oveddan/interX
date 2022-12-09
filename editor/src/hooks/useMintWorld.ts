import { GraphJSON } from '@behave-graph/core';
import { useEffect, useState } from 'react';
import { suspend } from 'suspend-react';
import { usePrepareContractWrite, useContractWrite, useContractEvent, useContractRead } from 'wagmi';
import { abi } from '../contracts/abi';
import chainNodesToChainSpec from '../nodes/chain/chainNodesToChainSpec';
import { SafeMintInputs, SocketIndecesByNodeType } from '../nodes/chain/IChainNode';

const toMintArgs = (
  cid: string,
  behaviorGraph: GraphJSON,
  socketIndecesByNodeType: SocketIndecesByNodeType | undefined
): SafeMintInputs => {
  // convert chain nodes to on chain node defininitions
  if (!socketIndecesByNodeType) return [cid, [], []];
  const { nodeDefinitions, edgeDefinitions } = chainNodesToChainSpec(behaviorGraph, socketIndecesByNodeType);

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
  const {
    data: socketIndecesByNodeType,
    error: readError,
    isLoading: readIsLoading,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'getSocketIndecesByNodeType',
  });

  // console.log({ readError, socketIndecesByNodeTypeOptional, readIsLoading });

  // const socketIndecesByNodeType = suspend(
  //   (socketIndecesByNodeTypeOptional) => {
  //     // if we have the socket indeces, we can return them
  //     if (socketIndecesByNodeTypeOptional) {
  //       console.log('return good');
  //       return new Promise<SocketIndecesByNodeType>((resolve) => resolve(socketIndecesByNodeTypeOptional));
  //     }

  //     console.log('return empty promise');
  //     // otherwise, return an empty promise that will never resolve
  //     return new Promise<SocketIndecesByNodeType>((resolve) => {});
  //   },
  //   [socketIndecesByNodeTypeOptional]
  // );

  const [args, setArgs] = useState(() => toMintArgs(worldCid, behaviorGraph, socketIndecesByNodeType));

  useEffect(() => {
    console.log({ socketIndecesByNodeType });
    const args = toMintArgs(worldCid, behaviorGraph, socketIndecesByNodeType);
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
