import { registerSceneDependency, IRegistry } from '@behave-graph/core';

import { useParams } from 'react-router-dom';
import useLoadOnChainWorld from '../hooks/useLoadOnChainWorld';
import Web3Login from '../web3/Web3Login';
import Scene from '../scene/Scene';
import useTokenContractAddress from '../web3/useTokenContractAddress';
import useChainGraph from '@blocktopia/core/src/hooks/useChainGraph';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { useEngine, useRegisterCoreProfileAndOthers } from '../hooks';
import { registerChainGraphDepenency, registerChainGraphProfile } from '@blocktopia/core';
import { useScene } from '../scene/useSceneModifier';
import { useRegisterDependency } from '../hooks/useRegisterDependency';

const LoadAndIntegrateOnChainWorldInner = ({
  tokenId,
  dependencies,
  contractAddress,
}: {
  tokenId: number;
  dependencies: IRegistry['dependencies'];
  contractAddress: `0x${string}`;
}) => {
  const smartContractActions = useChainGraph(contractAddress, tokenId);

  useRegisterDependency(dependencies, smartContractActions, registerChainGraphDepenency);

  return null;
};

const LoadAndIntegrateOnChainWorld = ({
  tokenId,
  dependencies,
}: {
  tokenId: number;
  dependencies: IRegistry['dependencies'] | undefined;
}) => {
  const contractAddress = useTokenContractAddress();

  if (!contractAddress || !dependencies) return null;
  return (
    <LoadAndIntegrateOnChainWorldInner
      tokenId={tokenId}
      dependencies={dependencies}
      contractAddress={contractAddress}
    />
  );
};

const OnChainWorld = ({
  dependencies,
  sceneFileUrl,
  tokenId,
}: {
  dependencies: IRegistry['dependencies'] | undefined;
  sceneFileUrl: string;
  tokenId: number;
}) => {
  const gltf = useGLTF(sceneFileUrl);

  const { scene, animations, sceneOnClickListeners } = useScene(gltf);

  useRegisterDependency(dependencies, scene, registerSceneDependency);

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

  const registerProfiles = useMemo(() => [registerChainGraphProfile, registerSceneProfile], []);

  const { registry, lifecyleEmitter } = useRegisterCoreProfileAndOthers({
    otherRegisters: registerProfiles,
  });

  useEngine({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter,
    autoRun: true,
  });

  if (!sceneFileUrl || !graphJson) return null;

  const dependencies = registry?.dependencies;

  return (
    <>
      <LoadAndIntegrateOnChainWorld tokenId={tokenId} dependencies={dependencies} />
      <OnChainWorld sceneFileUrl={sceneFileUrl} tokenId={tokenId} dependencies={dependencies} />
    </>
  );
};
const OnChainWorldWrapper = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const contractAddress = useTokenContractAddress();

  if (!tokenId || !contractAddress) return null;
  return <OnChainWorldLoader tokenId={+tokenId} contractAddress={contractAddress} />;
};

export default OnChainWorldWrapper;
