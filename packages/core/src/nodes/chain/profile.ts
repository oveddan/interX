import { Registry, Socket } from '@oveddan-behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainCounter } from './ChainCounter';
import { ChainVariableGet } from './ChainVariableGet';
import { ChainVariableSet } from './ChainVariableSet';
import { ExternalInvoke } from './ExternalInvoke';
import { ChainNodeTypes, ChainValueType, IHasOnChainDefinition } from './IChainNode';
import { SocketIO } from './socketGeneration';

const getChainDefinitions = (actions: IChainGraph) => [ChainCounter, ChainVariableSet, ExternalInvoke(actions)];

export function registerChainGraphProfile(registry: Registry, actions: IChainGraph) {
  const { nodes } = registry;

  getChainDefinitions(actions).forEach((x) => nodes.register(x));

  nodes.register(ChainVariableGet(actions));
}

export type NodeSocketIO = Record<
  string,
  SocketIO & {
    nodeType: ChainNodeTypes;
    inputValueType: ChainValueType;
  }
>;

export const makeChainNodeSpecs = (actions: IChainGraph): Record<string, IHasOnChainDefinition['chain']> => {
  const chainDefinitions = getChainDefinitions(actions);

  return chainDefinitions.reduce((acc: Record<string, IHasOnChainDefinition['chain']>, def) => {
    const chain = def.chain;
    if (!chain) throw new Error(`Chain definition for ${def.typeName} is missing!`);
    return {
      ...acc,
      [def.typeName]: chain,
    };
  }, {});
};
