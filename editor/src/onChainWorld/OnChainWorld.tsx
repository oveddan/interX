import { GraphJSON, Registry } from '@behave-graph/core';
import { useParams } from 'react-router-dom';
import useLoadOnChainWorld from '../hooks/useLoadOnChainWorld';
import Web3Login from '../web3/Web3Login';
import Scene from '../scene/Scene';
import useTokenContractAddress from '../web3/useTokenContractAddress';
import useChainGraph from '@blocktopia/core/src/hooks/useChainGraph';
import { IChainGraph } from '../../../packages/core/src/abstractions';
import { useGLTF } from '@react-three/drei';
import useSceneModifier from '../scene/useSceneModifier';
import { useCallback } from 'react';
import { useEngine, useRegistry } from '../hooks';
import { useRegisterChainGraphProfile } from '@blocktopia/core';

const OnChainWorld = ({
  graphJson,
  sceneFileUrl,
  smartContractActions,
  tokenId,
}: {
  graphJson: GraphJSON;
  sceneFileUrl: string;
  smartContractActions: IChainGraph;
  tokenId: number;
}) => {
  const gltf = useGLTF(sceneFileUrl);

  const { animations, sceneOnClickListeners, registerSceneProfile } = useSceneModifier(gltf);

  const registerChainGraphProfile = useRegisterChainGraphProfile(smartContractActions);

  const registerProfiles = useCallback(
    (registry: Registry) => {
      registerChainGraphProfile(registry);
      registerSceneProfile(registry);
    },
    [registerSceneProfile, registerChainGraphProfile]
  );

  const { registry, lifecyleEmitter } = useRegistry({
    registerProfiles,
  });

  useEngine({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter,
    autoRun: true,
  });

  return (
    <>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <div className="flex items-center">
            <img src="/interx.jpg" className="h-24" alt="Interx Logo" />
          </div>
          <div className="flex md:order-2">
            <Web3Login />
          </div>
          <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="navbar-cta">
            <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>Viewing On-Chain World on Token Id {tokenId}</li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="w-full h-full">
        <Scene gltf={gltf} animationsState={animations} onClickListeners={sceneOnClickListeners} />
      </div>
    </>
  );
};

const OnChainWorldLoader = ({ tokenId, contractAddress }: { tokenId: number; contractAddress: `0x${string}` }) => {
  const { graphJson, sceneFileUrl } = useLoadOnChainWorld(tokenId, contractAddress);

  const smartContractActions = useChainGraph(contractAddress, tokenId);

  if (!sceneFileUrl || !graphJson || !smartContractActions) return null;

  return (
    <OnChainWorld
      graphJson={graphJson}
      sceneFileUrl={sceneFileUrl}
      smartContractActions={smartContractActions}
      tokenId={tokenId}
    />
  );
};
const OnChainWorldWrapper = () => {
  const { tokenId } = useParams<{ tokenId: string }>();

  const contractAddress = useTokenContractAddress();

  if (!contractAddress || !tokenId) return null;
  return <OnChainWorldLoader tokenId={+tokenId} contractAddress={contractAddress} />;
};

export default OnChainWorldWrapper;
