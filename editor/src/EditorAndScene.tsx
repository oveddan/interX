import { Suspense } from 'react';
import Scene from './scene/Scene';
import '@rainbow-me/rainbowkit/styles.css';
import './styles/resizer.css';
import Controls from './flowEditor/components/Controls';
import Nav from './nav/Nav';
import PublishingControls from './web3/PublishingControls';
import useSetAndLoadModelFile, { exampleModelFileUrl } from './hooks/useSetAndLoadModelFile';
import Flow from './flowEditor/FlowEditorApp';
import SplitEditor from './SplitEditor';
import { examplePairs } from './flowEditor/components/LoadModal';
import { registerSceneProfile, registerSceneDependency, IRegistry } from '@oveddan-behave-graph/core';
import { useScene } from './scene/useSceneModifier';
import { registerChainGraphProfile } from '@blocktopia/core';
import { useRegisterDependency } from './hooks/useRegisterDependency';
import {
  useRegisterCoreProfileAndOthers,
  useBehaveGraphFlow,
  useGraphRunner,
  useNodeSpecJson,
} from '@oveddan-behave-graph/flow';
import { suspend } from 'suspend-react';
import { exampleBehaveGraphFileUrl, fetchBehaviorGraphJson } from './hooks/useSaveAndLoad';

const [initialModelFile, initialBehaviorGraph] = examplePairs[0];

const initialModelFileUrl = exampleModelFileUrl(initialModelFile);
const initialBehaviorGraphUrl = exampleBehaveGraphFileUrl(initialBehaviorGraph);

export const registerChainGraphProfiles: ((registry: Pick<IRegistry, 'nodes' | 'values'>) => void)[] = [
  registerChainGraphProfile,
  registerSceneProfile,
];

function EditorAndScene({ web3Enabled }: { web3Enabled?: boolean }) {
  const { modelFile, setModelFile, gltf } = useSetAndLoadModelFile({
    initialFileUrl: initialModelFileUrl,
  });

  const { registry, lifecyleEmitter } = useRegisterCoreProfileAndOthers({
    otherRegisters: registerChainGraphProfiles,
  });

  const specJson = useNodeSpecJson(registry);

  const initialGraphJson = suspend(async () => {
    return await fetchBehaviorGraphJson(initialBehaviorGraphUrl);
  }, []);

  const { nodes, edges, onNodesChange, onEdgesChange, graphJson, setGraphJson } = useBehaveGraphFlow({
    initialGraphJson,
    specJson,
  });

  const { togglePlay, playing } = useGraphRunner({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter,
  });

  const { scene, animations, sceneOnClickListeners } = useScene(gltf);

  useRegisterDependency(registry?.dependencies, scene, registerSceneDependency);

  const web3Controls = web3Enabled ? <PublishingControls graphJson={graphJson} modelFile={modelFile?.file} /> : null;

  const controls = specJson && (
    <Controls
      toggleRun={togglePlay}
      graphJson={graphJson}
      running={playing}
      additionalControls={web3Controls}
      setBehaviorGraph={setGraphJson}
      setModelFile={setModelFile}
    />
  );

  const flowEditor = specJson && (
    <Flow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      specJson={specJson}
      controls={controls}
      scene={scene}
    />
  );

  const interactiveModelPreview = gltf && (
    <Scene gltf={gltf} onClickListeners={sceneOnClickListeners} animationsState={animations} />
  );

  return (
    <>
      <Nav isWeb3Enabled={web3Enabled} />
      <div className="w-full h-full relative">
        <SplitEditor left={flowEditor} right={interactiveModelPreview} />
      </div>
    </>
  );
}

function EditorAndSceneWrapper(props: { web3Enabled?: boolean }) {
  return (
    <Suspense fallback={null}>
      <EditorAndScene {...props} />
    </Suspense>
  );
}

export default EditorAndSceneWrapper;
