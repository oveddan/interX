import { useEffect, useState } from 'react';
import { chain } from 'wagmi';
import { useAccount } from 'wagmi';
import { contractAddresses } from '@blocktopia/core';
import { buildSkaleChain } from './client';

const getContractAddress = (chainId: number): `0x${string}` => {
  const skaleChain = buildSkaleChain();
  const chains = [...Object.values(chain), skaleChain];

  const chainForId = chains.find((x) => x.id === chainId);

  if (!chainForId) {
    throw new Error(`invalid chain id ${chainForId}`);
  }

  let chainName = chainForId.name;

  if (chainName === 'Hardhat') {
    chainName = 'localhost';
  }

  if (chainName === 'Polygon Mumbai') {
    chainName = 'mumbai';
  }

  const genericAddresses = contractAddresses as { [address: string]: `0x${string}` };

  if (!genericAddresses[chainName]) throw new Error(`contract not deployed for chain ${chainName}`);

  return genericAddresses[chainName];
};

const useTokenContractAddress = () => {
  const { connector: activeConnector, isConnected } = useAccount();

  const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    (async () => {
      const chainId = await activeConnector?.getChainId();

      if (!chainId) return;

      const addressAndAbi = getContractAddress(chainId);

      setContractAddress(addressAndAbi);
    })();
  }, [activeConnector, isConnected]);

  return contractAddress;
};

export default useTokenContractAddress;
