import { Registry } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainCounter } from './ChainCounter';
import { ChainVariableGet } from './ChainVariableGet';
import { ChainVariableSet } from './ChainVariableSet';
import { ExternalTrigger } from './ExternalTrigger';

export function registerChainGraphProfile(registry: Registry, actions: IChainGraph) {
  const { nodes } = registry;

  nodes.register(ChainCounter.Description(actions));
  nodes.register(ChainVariableSet.Description(actions));
  nodes.register(ChainVariableGet.Description(actions));
  nodes.register(ExternalTrigger.Description(actions));
}
