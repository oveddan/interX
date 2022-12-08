import { GraphJSON, NodeJSON } from '@behave-graph/core';
import {
  ChainNodeDefinition,
  ChainEdgeNodeDefinition,
  IChainNode,
  ChainNodeDefinitionAndValues,
  ChainnInitialValues,
} from './IChainNode';

function isChainNode(node: any): node is IChainNode {
  return typeof node.chainNodeType !== undefined && typeof node.id !== undefined;
}

function appendInitialValue<T>(
  value: T,
  index: number,
  values: readonly { value: T; socket: number }[]
): { value: T; socket: number }[] {
  return [...values, { value, socket: index }];
}

const extractInitialValues = (node: IChainNode): ChainnInitialValues => {
  // for each input socket, get value from socket and append it to list of values
  return node.inputSockets.reduce(
    ({ booleans, integers, strings }: ChainnInitialValues, socket, index): ChainnInitialValues => {
      return {
        booleans:
          socket.valueTypeName === 'boolean' ? appendInitialValue<boolean>(socket.value, index, booleans) : booleans,
        integers:
          socket.valueTypeName === 'integer' ? appendInitialValue<bigint>(socket.value, index, integers) : integers,
        strings: socket.valueTypeName === 'string' ? appendInitialValue<string>(socket.value, index, strings) : strings,
      };
    },
    {
      booleans: [],
      integers: [],
      strings: [],
    }
  );
};

const getEdges = (nodeJSON: NodeJSON, nodeIndeces: { [id: string]: bigint }): ChainEdgeNodeDefinition[] => {
  return Object.entries(nodeJSON.flows || {}).map(
    ([inputKey, link]): ChainEdgeNodeDefinition => ({
      fromNode: nodeIndeces[nodeJSON.id],
      fromSocket: inputKey,
      // sourceHandle: inputKey,
      toNode: nodeIndeces[link.nodeId],
      toSocket: link.socket,
    })
  );
};

const chainNodesToChainSpec = (
  graph: GraphJSON
): {
  nodeDefinitions: ChainNodeDefinitionAndValues[];
  edgeDefinitions: ChainEdgeNodeDefinition[];
} => {
  if (!graph.nodes)
    return {
      nodeDefinitions: [],
      edgeDefinitions: [],
    };

  const chainNodes = graph.nodes.filter((x) => isChainNode(x)) as (IChainNode & NodeJSON)[];

  const chainNodeIndecesAndIds = chainNodes
    .map(({ id }, index) => ({ id, index }))
    .reduce((acc: { [key: string]: bigint }, { id, index }) => {
      return {
        ...acc,
        [id]: BigInt(index),
      };
    }, {});

  const nodeDefinitions: ChainNodeDefinitionAndValues[] = chainNodes.map(
    (x): ChainNodeDefinitionAndValues => ({
      definition: {
        id: chainNodeIndecesAndIds[x.id],
        defined: true,
        ...x.toNodeDefinition(),
      },
      initialValues: extractInitialValues(x),
    })
  );

  const edgeDefinitions = graph.nodes
    .map(getEdges)
    .reduce((acc: ChainEdgeNodeDefinition[], edges) => [...acc, ...edges], []);

  return {
    nodeDefinitions,
    edgeDefinitions,
  };
};

export default chainNodesToChainSpec;
