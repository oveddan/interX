import { useCallback, useEffect, useState } from 'react';
import { GraphJSON, Registry } from '@oveddan-behave-graph/core';
import { useGLTF } from '@react-three/drei';
import Scene from './Scene';
import { dataUrlFromFile } from '../hooks/useSaveAndLoad';
import { useMockSmartContractActions, useRegisterChainGraphProfile } from '@blocktopia/core';
import useSceneModifier from './useSceneModifier';
import { useEngine, useRegistry } from '../hooks';

const Inner = ({ fileDataUrl, graphJson }: { fileDataUrl: string; graphJson: GraphJSON }) => {
  const gltf = useGLTF(fileDataUrl);
  const smartContractActions = useMockSmartContractActions();

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

  return <Scene gltf={gltf} onClickListeners={sceneOnClickListeners} animationsState={animations} />;
};

const InteractiveModelPreview = ({ file, graphJson }: { file: File; graphJson: GraphJSON }) => {
  const [fileDataUrl, setFileDataUrl] = useState<string>();

  useEffect(() => {
    (async () => {
      setFileDataUrl(await dataUrlFromFile(file));
    })();
  }, [file]);

  if (!fileDataUrl) return null;

  return <Inner fileDataUrl={fileDataUrl} graphJson={graphJson} />;
};

export default InteractiveModelPreview;
