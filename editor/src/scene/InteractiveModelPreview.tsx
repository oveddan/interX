import { useEffect, useMemo, useState } from 'react';
import { GraphJSON, registerSceneProfile, registerSceneDependency } from '@oveddan-behave-graph/core';
import { useGLTF } from '@react-three/drei';
import Scene from './Scene';
import { dataUrlFromFile } from '../hooks/useSaveAndLoad';
import { registerChainGraphDepenency, registerChainGraphProfile, useMockSmartContractActions } from '@blocktopia/core';
import { useScene } from './useSceneModifier';
import { useRegisterDependency } from '../hooks/useRegisterDependency';
import useEngine from '../hooks/useEngine';
import { useRegisterCoreProfileAndOthers } from '../hooks/useRegistry';
import { registerChainGraphProfiles } from '../EditorAndScene';

const Inner = ({ fileDataUrl, graphJson }: { fileDataUrl: string; graphJson: GraphJSON }) => {
  const gltf = useGLTF(fileDataUrl);
  const smartContractActions = useMockSmartContractActions();

  const { scene, animations, sceneOnClickListeners } = useScene(gltf);

  const { registry, lifecyleEmitter } = useRegisterCoreProfileAndOthers({
    otherRegisters: registerChainGraphProfiles,
  });

  useRegisterDependency(registry?.dependencies, smartContractActions, registerChainGraphDepenency);
  useRegisterDependency(registry?.dependencies, scene, registerSceneDependency);

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
