import {
  FlowsJSON,
  NodeJSON,
  NodeParameterJSON,
  NodeParameterLinkJSON,
  SocketDefinition,
  SocketsDefinition,
} from '@behave-graph/core';
import { SocketIndecesByNodeTypeStruct } from 'typechain-types/contracts/BehaviorGraphToken';
import { ChainEdgeNodeDefinition, SocketMappings, ToOnChainDefinitionForNode } from '../IChainNode';

function getSocketIndecesForNodeMapping<TSocketIdKey extends keyof SocketIndecesByNodeTypeStruct>({
  socketMappings,
  socketIdKey,
  fromSocket,
  socketIndeces,
}: {
  socketMappings: SocketMappings<SocketsDefinition, TSocketIdKey> | undefined;
  socketIdKey: TSocketIdKey;
  fromSocket: string;
  socketIndeces: SocketIndecesByNodeTypeStruct;
}) {
  if (!socketMappings) throw new Error('out not configured');
  const fromSocketIndexKey = socketMappings[fromSocket];
  if (!fromSocketIndexKey) throw new Error(`missing socket mapping for key: ${fromSocket}`);
  // @ts-ignore
  return socketIndeces[socketIdKey][fromSocketIndexKey];
}

const isLink = (param: NodeParameterJSON): param is NodeParameterLinkJSON => {
  return (param as NodeParameterLinkJSON).link !== undefined;
};

/**
 * Needs to convert from sockets that are declared as strings to integers, as thats how they are stored on chain.
 * So this will for each flow, generate the edge, and use the socketIndeces and the toOnChainNode
 * definitions for the source and destination node to get the correct socket index.
 * @param param0
 * @returns
 */
export function getOnChainEdges({
  node,
  nodes,
  toOnChainNodeDefinitions,
  socketIndeces,
}: {
  node: NodeJSON;
  nodes: NodeJSON[];
  toOnChainNodeDefinitions: Record<string, ToOnChainDefinitionForNode>;
  socketIndeces: SocketIndecesByNodeTypeStruct;
}): ChainEdgeNodeDefinition[] {
  const edges: ChainEdgeNodeDefinition[] = [];
  // get instructions on how to convert from this node's node ids
  // to corresponding on chain integers
  const thisOnChainNodeDefinition = toOnChainNodeDefinitions[node.type];

  if (!thisOnChainNodeDefinition) {
    throw new Error(`missing node spec for node type: ${node.type}`);
  }

  const thisNodeId = node.id;

  // get edges from the output flows
  Object.entries(node.flows || {}).forEach(([fromSocket, { nodeId: flowNodeId, socket: toSocket }]) => {
    const otherNode = nodes.find((n) => n.id === flowNodeId);
    if (!otherNode) return;

    const edge = getOnChainEdge({
      socketIndeces,
      sourceNodeId: thisNodeId,
      sourceOnChainNodeDefinition: thisOnChainNodeDefinition,
      sourceSocket: fromSocket,
      destinationNodeId: flowNodeId,
      destinationNodeToOnChainNodeDefinition: toOnChainNodeDefinitions[otherNode.type],
      destinationSocket: toSocket,
    });

    edges.push(edge);
  });

  // parameters links point backwards (it's wierd), so we need to make an edge in the reverse direction
  // from the parameter
  Object.entries(node.parameters || {}).forEach(([toSocket, param]) => {
    if (isLink(param)) {
      const { nodeId: fromNodeId, socket: fromSocket } = param.link;
      const otherNode = nodes.find((n) => n.id === fromNodeId);
      if (!otherNode) return;

      const edge = getOnChainEdge({
        socketIndeces,
        sourceNodeId: fromNodeId,
        sourceOnChainNodeDefinition: toOnChainNodeDefinitions[otherNode.type],
        sourceSocket: fromSocket,
        destinationNodeId: thisNodeId,
        destinationNodeToOnChainNodeDefinition: thisOnChainNodeDefinition,
        destinationSocket: toSocket,
      });

      edges.push(edge);
    }
  });

  return edges;
}
function getOnChainEdge({
  sourceNodeId,
  destinationNodeId,
  socketIndeces,
  sourceOnChainNodeDefinition,
  sourceSocket,
  destinationNodeToOnChainNodeDefinition,
  destinationSocket,
}: {
  sourceNodeId: string;
  destinationNodeId: string;
  socketIndeces: SocketIndecesByNodeTypeStruct;
  sourceOnChainNodeDefinition: ToOnChainDefinitionForNode;
  sourceSocket: string;
  destinationNodeToOnChainNodeDefinition: ToOnChainDefinitionForNode;
  destinationSocket: string;
}) {
  const socketIndexFrom = getSocketIndecesForNodeMapping({
    socketIdKey: sourceOnChainNodeDefinition.socketIdKey,
    socketMappings: sourceOnChainNodeDefinition.socketMappings.out,
    fromSocket: sourceSocket,
    socketIndeces,
  });

  // get the socket index for the destination node
  const socketIndexTo = getSocketIndecesForNodeMapping({
    socketIdKey: destinationNodeToOnChainNodeDefinition.socketIdKey,
    socketMappings: destinationNodeToOnChainNodeDefinition.socketMappings.in,
    fromSocket: destinationSocket,
    socketIndeces,
  });

  const result: ChainEdgeNodeDefinition = {
    fromNode: sourceNodeId,
    fromSocket: socketIndexFrom as number,
    toNode: destinationNodeId,
    toSocket: socketIndexTo as number,
  };

  return result;
}
