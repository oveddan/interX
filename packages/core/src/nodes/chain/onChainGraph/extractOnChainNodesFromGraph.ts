import { GraphJSON, NodeJSON, NodeParameterJSON, NodeParameterValueJSON } from '@behave-graph/core';
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
import { makeToOnChainNodeConverterters } from '../profile';
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
      return acc;
      // if (!isNodeParameterValueJSON(param)) return acc;

      // const input = nodes[node.type].getInput(key);
      // if (!input) return acc;

      // const { index, valueTypeName } = input;

      // const { booleans, integers, strings } = acc;
      // return {
      //   booleans:
      //     valueTypeName === 'boolean' ? appendInitialValue<boolean>(param.value as boolean, index, booleans) : booleans,
      //   integers:
      //     valueTypeName === 'integer' ? appendInitialValue<bigint>(BigInt(param.value), index, integers) : integers,
      //   strings:
      //     valueTypeName === 'string' ? appendInitialValue<string>(param.value as string, index, strings) : strings,
      // };
    },
    {
      booleans: [],
      integers: [],
      strings: [],
    }
  );
};

export function chainNodeToNodeDefinitionAndEdges({
  node,
  nodeSpec,
  nodes,
  socketIndecesByNodeType,
}: {
  node: NodeJSON;
  nodeSpec: ToOnChainDefinitionForNode;
  nodes: NodeJSON[];
  socketIndecesByNodeType: SocketIndecesByNodeType;
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

  const edgeDefinitions = getOnChainEdges({
    node,
    nodes,
    toOnChainNodeDefinitions: makeToOnChainNodeConverterters(),
    socketIndeces: socketIndecesByNodeType,
  });

  return {
    nodeDefinition,
    edgeDefinitions,
  };
}

/**
 * Takes a behavior graph and instructions on how to map socket ids to on chain integers
 * and generates the parameters needed to create the on chain nodes and edges.
 * @param param0
 * @returns
 */
export const generateOnChainNodesFromGraph = ({
  graph,
  socketIndecesByNodeType,
}: {
  graph: GraphJSON;
  socketIndecesByNodeType: SocketIndecesByNodeType;
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
  const chainNodeSpecs = makeToOnChainNodeConverterters();

  // get chain node specs for each node
  const chainNodes = nodes
    .filter((x) => !!chainNodeSpecs[x.type])
    .map((node) => ({
      node,
      spec: chainNodeSpecs[node.type],
    }));

  const nodeAndEdgeDefinitions = chainNodes.map(({ node, spec }) =>
    chainNodeToNodeDefinitionAndEdges({ node, nodeSpec: spec, nodes, socketIndecesByNodeType })
  );

  const nodeDefinitions = nodeAndEdgeDefinitions.map(({ nodeDefinition }) => nodeDefinition);
  const edgeDefinitions = nodeAndEdgeDefinitions.flatMap(({ edgeDefinitions }) => edgeDefinitions);

  return {
    nodeDefinitions,
    edgeDefinitions,
  };
};
