import { useEffect, useState } from 'react';
import { GraphJSON, registerSceneDependency } from '@oveddan-behave-graph/core';
import { useGLTF } from '@react-three/drei';
import Scene from './Scene';
import { dataUrlFromFile } from '../hooks/useSaveAndLoad';
import { registerChainGraphDepenency, useMockSmartContractActions } from '@blocktopia/core';
import { useScene } from './useSceneModifier';
import { useRegisterDependency } from '../hooks/useRegisterDependency';
import { registerChainGraphProfiles } from '../EditorAndScene';
import { useGraphRunner, useRegisterCoreProfileAndOthers } from '@oveddan-behave-graph/flow';

const Inner = ({ fileDataUrl, graphJson }: { fileDataUrl: string; graphJson: GraphJSON }) => {
  const gltf = useGLTF(fileDataUrl);
  const smartContractActions = useMockSmartContractActions();

  const { scene, animations, sceneOnClickListeners } = useScene(gltf);

  const { registry, lifecyleEmitter } = useRegisterCoreProfileAndOthers({
    otherRegisters: registerChainGraphProfiles,
  });

  useRegisterDependency(registry?.dependencies, smartContractActions, registerChainGraphDepenency);
  useRegisterDependency(registry?.dependencies, scene, registerSceneDependency);

  useGraphRunner({
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
