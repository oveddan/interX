import ReactFlow, { Background, BackgroundVariant, OnNodesChange, OnEdgesChange, Node, Edge } from 'reactflow';
import NodePicker from './components/NodePicker';
import { NodeSpecJSON } from '@behave-graph/core';
import 'reactflow/dist/style.css';
import './flowEditor.css';
import { ISceneWithQueries } from '@blocktopia/core';
import { useFlowHandlers } from '@behave-graph/flow';
import { useCustomNodeTypes, useBehaveGraphFlow } from '@behave-graph/flow';

type BehaveGraphFlow = ReturnType<typeof useBehaveGraphFlow>;

function Flow({
  nodes,
  onNodesChange,
  edges,
  onEdgesChange,
  specJson,
  scene,
  controls,
}: {
  nodes: Node<any>[];
  edges: Edge<any>[];
  specJson: NodeSpecJSON[];
  scene: ISceneWithQueries | undefined;
  controls: JSX.Element | undefined;
} & Pick<BehaveGraphFlow, 'onNodesChange' | 'onEdgesChange'>) {
  const {
    onConnect,
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    nodePickerVisibility,
    handleAddNode,
    closeNodePicker,
    nodePickFilters,
  } = useFlowHandlers({
    nodes,
    onEdgesChange,
    onNodesChange,
    specJSON: specJson,
  });

  const customNodeTypes = useCustomNodeTypes({
    specJson,
  });

  if (!customNodeTypes) return null;

  return (
    <>
      <ReactFlow
        nodeTypes={customNodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={handleStartConnect}
        onConnectEnd={handleStopConnect}
        fitView
        fitViewOptions={{ maxZoom: 1 }}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneContextMenu}
      >
        {controls}
        <Background variant={BackgroundVariant.Lines} color="#2a2b2d" style={{ backgroundColor: '#1E1F22' }} />
        {nodePickerVisibility && (
          <NodePicker
            position={nodePickerVisibility}
            filters={nodePickFilters}
            onPickNode={handleAddNode}
            onClose={closeNodePicker}
            specJson={specJson}
          />
        )}
      </ReactFlow>
    </>
  );
}

export default Flow;
