import { NodeJSON, SocketDefinition, SocketsDefinition } from '@behave-graph/core';
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
  const toOnChainNodeDefinition = toOnChainNodeDefinitions[node.type];

  if (!toOnChainNodeDefinition) {
    throw new Error(`missing node spec for node type: ${node.type}`);
  }

  Object.entries(node.flows || {}).forEach(([fromSocket, { nodeId, socket: toSocket }]) => {
    const otherNode = nodes.find((n) => n.id === nodeId);
    if (!otherNode) return;

    const destinationNodeToOnChainNodeDefinition = toOnChainNodeDefinitions[otherNode.type];

    if (!destinationNodeToOnChainNodeDefinition) {
      console.log(otherNode.type, Object.keys(toOnChainNodeDefinitions));
      throw new Error(`missing node spec for other node type: ${otherNode.type}`);
    }

    // get the socket index for the source node
    const socketIndexFrom = getSocketIndecesForNodeMapping({
      socketIdKey: toOnChainNodeDefinition.socketIdKey,
      socketMappings: toOnChainNodeDefinition.socketMappings.out,
      fromSocket,
      socketIndeces,
    });

    // get the socket index for the destination node
    const socketIndexTo = getSocketIndecesForNodeMapping({
      socketIdKey: destinationNodeToOnChainNodeDefinition.socketIdKey,
      socketMappings: destinationNodeToOnChainNodeDefinition.socketMappings.in,
      fromSocket: toSocket,
      socketIndeces,
    });

    edges.push({
      fromNode: node.id,
      fromSocket: socketIndexFrom as number,
      toNode: nodeId,
      toSocket: socketIndexTo as number,
    });
  });

  return edges;
}
