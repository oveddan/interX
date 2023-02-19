import { useEffect, useMemo, useState } from 'react';
import { useContractRead } from 'wagmi';
import { BigNumber } from 'ethers';
import { loadStoredSceneAndBehaviorGraphFromIpfs } from './ipfs/ipfsSceneLoader';
import { ipfsUrlToCid } from './ipfs/ipfsUrlUtils';
import { GraphJSON } from '@behave-graph/core';
import { abi } from '../contracts/abi';

export const useLoadOnChainWorld = (tokenId: number, contractAddress: `0x${string}`) => {
  const tokenIdArgs = useMemo((): [BigNumber] => [BigNumber.from(tokenId)], [tokenId]);

  const { data: tokenURI } = useContractRead({
    abi,
    address: contractAddress,
    functionName: 'tokenURI',
    args: tokenIdArgs,
  });

  const [sceneFileUrl, setSceneFileUrl] = useState<string>();
  const [graphJson, setGraphJson] = useState<GraphJSON>();

  useEffect(() => {
    if (!tokenURI) return;

    const cid = ipfsUrlToCid(tokenURI);

    (async () => {
      const { sceneFile, graphJSON } = await loadStoredSceneAndBehaviorGraphFromIpfs(cid);

      const sceneFileUrl = window.URL.createObjectURL(sceneFile);

      setSceneFileUrl(sceneFileUrl);
      setGraphJson(graphJSON);
    })();
  }, [tokenURI]);

  return {
    sceneFileUrl,
    graphJson,
  };
};