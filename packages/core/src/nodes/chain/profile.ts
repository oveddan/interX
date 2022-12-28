import { Registry, Socket } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { chainCointerSocketSpec, ChainCounter } from './ChainCounter';
import { ChainVariableGet } from './ChainVariableGet';
import { ChainVariableSet, chainVariableSetSocketSpec } from './ChainVariableSet';
import { ExternalTrigger, externalTriggerSocketSpec } from './ExternalTrigger';
import { ChainNodeTypes, ChainValueType, SocketIndecesByNodeType } from './IChainNode';
import { generateInputOutputSocketMappings, SocketIO } from './socketGeneration';

export function registerChainGraphProfile(registry: Registry, actions: IChainGraph) {
  const { nodes } = registry;

  nodes.register(ChainCounter.Description());
  nodes.register(ChainVariableSet.Description(actions));
  nodes.register(ChainVariableGet.Description(actions));
  nodes.register(ExternalTrigger.Description(actions));
}

export type NodeSocketIO = Record<
  string,
  SocketIO & {
    nodeType: ChainNodeTypes;
    inputValueType: ChainValueType;
  }
>;

export const makeChainNodeSpecs = (socketIndeces: SocketIndecesByNodeType): NodeSocketIO =>
  [chainCointerSocketSpec, chainVariableSetSocketSpec, externalTriggerSocketSpec].reduce((acc: NodeSocketIO, x) => {
    const { nodeType, nodeTypeName, inputValueType, inputSockets, outputSockets, socketNames, socketIndecesForType } =
      x;
    const { getInput, getOutput } = generateInputOutputSocketMappings(
      {
        inputSockets: inputSockets(),
        outputSockets: outputSockets(),
      },
      socketNames,
      socketIndecesForType(socketIndeces)
    );

    return {
      ...acc,
      [nodeTypeName]: {
        nodeType: nodeType,
        inputValueType: inputValueType,
        getInput,
        getOutput,
      },
    };
  }, {});
