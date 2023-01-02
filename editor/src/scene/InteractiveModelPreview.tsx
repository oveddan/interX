import { useCallback, useEffect, useMemo, useState } from 'react';
import { GraphJSON, registerSceneProfile, Registry } from '@behave-graph/core';
import { useGLTF } from '@react-three/drei';
import Scene from './Scene';
import { dataUrlFromFile } from '../hooks/useSaveAndLoad';
import { registerChainGraphProfile, useMockSmartContractActions } from '@blocktopia/core';
import { useEngine, useRegisterCoreProfileAndOthers } from '../hooks';
import { useScene } from './useSceneModifier';

const Inner = ({ fileDataUrl, graphJson }: { fileDataUrl: string; graphJson: GraphJSON }) => {
  const gltf = useGLTF(fileDataUrl);
  const smartContractActions = useMockSmartContractActions();

  const { scene, animations, sceneOnClickListeners } = useScene(gltf);

  const registerProfiles = useMemo(() => [registerChainGraphProfile, registerSceneProfile], []);

  const { registry, lifecyleEmitter } = useRegisterCoreProfileAndOthers({
    otherRegistries: registerProfiles,
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
