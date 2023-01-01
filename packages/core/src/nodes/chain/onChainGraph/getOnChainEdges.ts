import { NodeJSON } from '@oveddan-behave-graph/core';
import { SocketIndecesByNodeTypeStruct } from 'typechain-types/contracts/BehaviorGraphToken';
import { ChainEdgeNodeDefinition, ToOnChainDefinitionForNode } from '../IChainNode';

export function getOnChainEdges(
  node: NodeJSON,
  nodes: NodeJSON[],
  chainNodeSpecs: Record<string, ToOnChainDefinitionForNode>,
  socketIndeces: SocketIndecesByNodeTypeStruct
): ChainEdgeNodeDefinition[] {
  const edges: ChainEdgeNodeDefinition[] = [];
  const nodeSpec = chainNodeSpecs[node.type];

  if (!nodeSpec) {
    throw new Error(`missing node spec for node type: ${node.type}`);
  }

  Object.entries(node.flows || {}).forEach(([fromSocket, { nodeId, socket: toSocket }]) => {
    const otherNode = nodes.find((n) => n.id === nodeId);
    if (!otherNode) return;

    const otherNodeSpec = chainNodeSpecs[otherNode.type];

    if (!otherNodeSpec) {
      console.log(otherNode.type, Object.keys(chainNodeSpecs));
      throw new Error(`missing node spec for other node type: ${otherNode.type}`);
    }

    if (!nodeSpec.socketMappings.out) throw new Error('out not configured');
    const fromSocketIndexKey = nodeSpec.socketMappings.out[fromSocket];
    if (!fromSocketIndexKey) throw new Error(`missing socket mapping for key: ${fromSocket}`);
    const socketIndexFrom = socketIndeces[nodeSpec.socketIdKey][fromSocketIndexKey];

    if (!otherNodeSpec.socketMappings.in) throw new Error('other spec in not configured');
    const toSocketIndexKey = otherNodeSpec.socketMappings.in[toSocket];
    if (!toSocketIndexKey) throw new Error(`missing socket mapping for key: ${toSocket}`);
    const socketIndexTo = socketIndeces[otherNodeSpec.socketIdKey][toSocketIndexKey];

    edges.push({
      fromNode: node.id,
      fromSocket: socketIndexFrom as number,
      toNode: nodeId,
      toSocket: socketIndexTo as number,
    });
  });

  return edges;
}
