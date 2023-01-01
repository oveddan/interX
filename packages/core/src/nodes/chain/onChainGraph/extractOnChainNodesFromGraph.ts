import {
  GraphJSON,
  NodeJSON,
  NodeParameterJSON,
  NodeParameterValueJSON,
  SocketsDefinition,
} from '@oveddan-behave-graph/core';
import { BigNumberish } from 'ethers';
import { PromiseOrValue } from 'typechain-types/common';
import { IChainGraph } from '../../../abstractions';
import {
  ChainEdgeNodeDefinition,
  ChainNodeDefinitionAndValues,
  ChainnInitialValues,
  SocketIndecesByNodeType,
  IHasOnChainDefinition,
  emptyNodeConfig,
  ToOnChainDefinitionForNode,
} from '../IChainNode';
import { makeToOnChainNodeConverterters, NodeSocketIO } from '../profile';
import { getOnChainEdges } from './getOnChainEdges';

function appendInitialValue<T>(
  value: T,
  index: number,
  values: readonly { value: T; socket: number }[]
): { value: T; socket: number }[] {
  return [...values, { value, socket: index }];
}

function isNodeParameterValueJSON(node: NodeParameterJSON): node is NodeParameterValueJSON {
  // @ts-ignore
  return typeof node.value !== undefined;
}

const extractInitialValues = (node: NodeJSON, spec: IHasOnChainDefinition['chain']): ChainnInitialValues => {
  // for each input socket, get value from socket and append it to list of values
  return Object.entries(node.parameters || {}).reduce(
    (acc: ChainnInitialValues, [key, param]): ChainnInitialValues => {
      if (!isNodeParameterValueJSON(param)) return acc;

      const input = nodes[node.type].getInput(key);
      if (!input) return acc;

      const { index, valueTypeName } = input;

      const { booleans, integers, strings } = acc;
      return {
        booleans:
          valueTypeName === 'boolean' ? appendInitialValue<boolean>(param.value as boolean, index, booleans) : booleans,
        integers:
          valueTypeName === 'integer' ? appendInitialValue<bigint>(BigInt(param.value), index, integers) : integers,
        strings:
          valueTypeName === 'string' ? appendInitialValue<string>(param.value as string, index, strings) : strings,
      };
    },
    {
      booleans: [],
      integers: [],
      strings: [],
    }
  );
};

// export const getEdges = (
//   nodeJSON: NodeJSON,
//   otherNodes: NodeJSON[],
//   nodeSockets: NodeSocketIO
// ): ChainEdgeNodeDefinition[] => {
//   const fromNodeType = nodeJSON.type;
//   const result = Object.entries(nodeJSON.flows || {})
//     .map(([inputKey, link]): ChainEdgeNodeDefinition | undefined => {
//       const fromNodeSocket = nodeSockets[fromNodeType]?.getOutput(inputKey);
//       console.log({ fromNodeSocket, inputKey, fromNodeType, socketSpec: nodeSockets[fromNodeType] });
//       if (!fromNodeSocket) return undefined;

//       const toNode = otherNodes.find((x) => x.id === link.nodeId);

//       const toSocket = toNode ? nodeSockets[toNode.type]?.getInput(link.socket) : undefined;

//       if (!toSocket) return;

//       return {
//         fromNode: nodeJSON.id,
//         fromSocket: fromNodeSocket.index,
//         // sourceHandle: inputKey,
//         toNode: link.nodeId,
//         toSocket: toSocket.index,
//       };
//     })
//     .filter((x): x is ChainEdgeNodeDefinition => !!x);

//   return result;
// };

export function chainNodeToNodeDefinitionAndEdges({
  node,
  nodeSpec,
  nodes,
  socketIndecesByNodeType,
  chainGraph,
}: {
  node: NodeJSON;
  nodeSpec: ToOnChainDefinitionForNode;
  nodes: NodeJSON[];
  socketIndecesByNodeType: SocketIndecesByNodeType;
  chainGraph: IChainGraph;
}): {
  nodeDefinition: ChainNodeDefinitionAndValues;
  edgeDefinitions: ChainEdgeNodeDefinition[];
} {
  const nodeDefinition: ChainNodeDefinitionAndValues = {
    definition: {
      id: node.id,
      defined: true,
      inputValueType: nodeSpec.inputValueType,
      nodeType: nodeSpec.nodeType,
    },
    config: {
      ...emptyNodeConfig,
      ...(nodeSpec.getConfig ? nodeSpec.getConfig(node.configuration) : {}),
    },
    initialValues: extractInitialValues(node, nodeSpec),
  };

  const edgeDefinitions = getOnChainEdges(
    node,
    nodes,
    makeToOnChainNodeConverterters(chainGraph),
    socketIndecesByNodeType
  );

  return {
    nodeDefinition,
    edgeDefinitions,
  };
}

export const extractOnChainNodesFromGraph = ({
  graph,
  socketIndecesByNodeType,
  chainGraph,
}: {
  graph: GraphJSON;
  socketIndecesByNodeType: SocketIndecesByNodeType;
  chainGraph: IChainGraph;
}): {
  nodeDefinitions: ChainNodeDefinitionAndValues[];
  edgeDefinitions: ChainEdgeNodeDefinition[];
} => {
  const nodes = graph.nodes;
  if (!nodes)
    return {
      nodeDefinitions: [],
      edgeDefinitions: [],
    };

  // using the graph, get the chain node specs for each node type
  const chainNodeSpecs = makeToOnChainNodeConverterters(chainGraph);

  // get chain node specs for each node
  const chainNodes = nodes
    .filter((x) => !!chainNodeSpecs[x.type])
    .map((node) => ({
      node,
      spec: chainNodeSpecs[node.type],
    }));

  const nodeAndEdgeDefinitions = chainNodes.map(({ node, spec }) =>
    chainNodeToNodeDefinitionAndEdges({ node, nodeSpec: spec, nodes, socketIndecesByNodeType, chainGraph: chainGraph })
  );

  const nodeDefinitions = nodeAndEdgeDefinitions.map(({ nodeDefinition }) => nodeDefinition);
  const edgeDefinitions = nodeAndEdgeDefinitions.flatMap(({ edgeDefinitions }) => edgeDefinitions);

  return {
    nodeDefinitions,
    edgeDefinitions,
  };
};
