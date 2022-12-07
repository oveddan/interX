import { GraphJSON, NodeJSON } from '@behave-graph/core';
import { ChainNodeDefinition, ChainEdgeNodeDefinition, IChainNode } from './IChainNode';

function isChainNode(node: any): node is IChainNode {
  return typeof node.chainNodeType !== undefined && typeof node.id !== undefined;
}

const getEdges = (nodeJSON: NodeJSON): ChainEdgeNodeDefinition[] => {
  return Object.entries(nodeJSON.flows || {}).map(
    ([inputKey, link]): ChainEdgeNodeDefinition => ({
      fromNode: nodeJSON.id,
      fromSocket: inputKey,
      // sourceHandle: inputKey,
      toNode: link.nodeId,
      toSocket: link.socket,
    })
  );
};

const chainNodesToChainSpec = (
  graph: GraphJSON
): {
  nodeDefinitions: ChainNodeDefinition[];
  edgeDefinitions: ChainEdgeNodeDefinition[];
} => {
  if (!graph.nodes)
    return {
      nodeDefinitions: [],
      edgeDefinitions: [],
    };

  const chainNodes = graph.nodes.filter((x) => isChainNode(x)) as (IChainNode & NodeJSON)[];

  const nodeDefinitions: ChainNodeDefinition[] = chainNodes.map((x) => ({
    id: x.id,
    defined: true,
    ...x.toNodeDefinition(),
  }));

  const edgeDefinitions = graph.nodes
    .map(getEdges)
    .reduce((acc: ChainEdgeNodeDefinition[], edges) => [...acc, ...edges], []);

  return {
    nodeDefinitions,
    edgeDefinitions,
  };
};

export default chainNodesToChainSpec;
