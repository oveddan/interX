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

  nodes.register(ChainCounter.Description(actions));
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
    return {
      ...acc,
      [x.nodeTypeName]: {
        nodeType: x.nodeType,
        inputValueType: x.inputValueType,
        ...generateInputOutputSocketMappings(
          {
            inputSockets: x.inputSockets(),
            outputSockets: x.outputSockets(),
          },
          x.socketNames,
          x.socketIndecesForType(socketIndeces)
        ),
      },
    };
  }, {});
