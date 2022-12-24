import { GraphJSON, NodeJSON, NodeParameterJSON, NodeParameterValueJSON } from '@behave-graph/core';
import {
  ChainEdgeNodeDefinition,
  ChainNodeDefinitionAndValues,
  ChainnInitialValues,
  SocketIndecesByNodeType,
} from './IChainNode';
import { makeChainNodeSpecs, NodeSocketIO } from './profile';

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

const extractInitialValues = (node: NodeJSON, nodes: NodeSocketIO): ChainnInitialValues => {
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

const getEdges = (nodeJSON: NodeJSON, otherNodes: NodeJSON[], nodeSockets: NodeSocketIO): ChainEdgeNodeDefinition[] => {
  const fromNodeType = nodeJSON.type;
  const result = Object.entries(nodeJSON.flows || {})
    .map(([inputKey, link]): ChainEdgeNodeDefinition | undefined => {
      const fromNodeSocket = nodeSockets[fromNodeType]?.getInput(inputKey);
      if (!fromNodeSocket) return undefined;

      const toNode = otherNodes.find((x) => x.id === link.nodeId);

      const toSocket = toNode ? nodeSockets[toNode.type]?.getOutput(link.socket) : undefined;

      if (!toSocket) return;

      return {
        fromNode: nodeJSON.id,
        fromSocket: fromNodeSocket.index,
        // sourceHandle: inputKey,
        toNode: link.nodeId,
        toSocket: toSocket.index,
      };
    })
    .filter((x): x is ChainEdgeNodeDefinition => !!x);

  return result;
};

export const extractOnChainNodesFromGraph = (
  graph: GraphJSON,
  socketIndecesByNodeType: SocketIndecesByNodeType
): {
  nodeDefinitions: ChainNodeDefinitionAndValues[];
  edgeDefinitions: ChainEdgeNodeDefinition[];
} => {
  const nodes = graph.nodes;
  if (!nodes)
    return {
      nodeDefinitions: [],
      edgeDefinitions: [],
    };

  const chainNodeSpecs = makeChainNodeSpecs(socketIndecesByNodeType);

  const chainNodes = nodes
    .filter((x) => !!chainNodeSpecs[x.type])
    .map((node) => ({
      node,
      spec: chainNodeSpecs[node.type],
    }));

  const nodeDefinitions: ChainNodeDefinitionAndValues[] = chainNodes.map(
    ({ node: x, spec }): ChainNodeDefinitionAndValues => ({
      definition: {
        id: x.id,
        defined: true,
        inputValueType: spec.inputValueType,
        nodeType: spec.nodeType,
      },
      initialValues: extractInitialValues(x, chainNodeSpecs),
    })
  );

  const edgeDefinitions = nodes
    .map((node) => getEdges(node, nodes, chainNodeSpecs))
    .reduce((acc: ChainEdgeNodeDefinition[], edges) => [...acc, ...edges], []);

  debugger;

  return {
    nodeDefinitions,
    edgeDefinitions,
  };
};
