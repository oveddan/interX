import { Registry, Socket } from '@oveddan-behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { OnChainCounter } from './OnChainCounter';
import { OnChainVariableGet } from './OnChainVariableGet';
import { OnChainVariableSet } from './OnChainVariableSet';
import { ExternalInvoke } from './ExternalInvoke';
import { ChainNodeTypes, ChainValueType, IHasOnChainDefinition } from './IChainNode';
import { SocketIO } from './socketGeneration';

const getChainDefinitions = (actions: IChainGraph) => [OnChainCounter, OnChainVariableSet, ExternalInvoke(actions)];

export function registerChainGraphProfile(registry: Registry, actions: IChainGraph) {
  const { nodes } = registry;

  getChainDefinitions(actions).forEach((x) => nodes.register(x));

  nodes.register(OnChainVariableGet(actions));
}

export type NodeSocketIO = Record<
  string,
  SocketIO & {
    nodeType: ChainNodeTypes;
    inputValueType: ChainValueType;
  }
>;

/**
 * Makes a mapping of node type to the on chain node converter.
 * @param actions
 * @returns a mapping of node type to the on chain node converter.
 */
export const makeToOnChainNodeConverterters = (
  actions: IChainGraph
): Record<string, IHasOnChainDefinition['chain']> => {
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
