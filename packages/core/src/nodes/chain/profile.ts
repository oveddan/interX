import { IRegistry, Registry } from '@oveddan-behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { OnChainCounter } from './OnChainCounter';
import { chainGraphDependencyKey, OnChainVariableGet } from './OnChainVariableGet';
import { OnChainVariableSet } from './OnChainVariableSet';
import { InvokeOnChainAction } from './InvokeOnChainAction';
import { ChainNodeTypes, ChainValueType, IHasOnChainDefinition } from './IChainNode';
import { SocketIO } from './socketGeneration';

const getChainDefinitions = () => [OnChainCounter, OnChainVariableSet, InvokeOnChainAction];

export function registerChainGraphProfile(registry: Pick<IRegistry, 'nodes' | 'values'>) {
  getChainDefinitions().forEach((x) => registry.nodes.register(x));

  registry.nodes.register(OnChainVariableGet);
}

export function registerChainGraphDepenency(dependencies: IRegistry['dependencies'], chainGraph: IChainGraph) {
  dependencies.register(chainGraphDependencyKey, chainGraph);
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
export const makeToOnChainNodeConverterters = (): Record<string, IHasOnChainDefinition['chain']> => {
  const chainDefinitions = getChainDefinitions();

  return chainDefinitions.reduce((acc: Record<string, IHasOnChainDefinition['chain']>, def) => {
    const chain = def.chain;
    if (!chain) throw new Error(`Chain definition for ${def.typeName} is missing!`);
    return {
      ...acc,
      [def.typeName]: chain,
    };
  }, {});
};
