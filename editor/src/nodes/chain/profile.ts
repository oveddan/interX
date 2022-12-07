import { Registry } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainCounter } from './ChainCounter';
import { ChainValue } from './ChainValue';
import { ExternalTrigger } from './ExternalTrigger';

export function registerChainGraphProfile(registry: Registry, actions: IChainGraph) {
  const { nodes } = registry;

  nodes.register(ChainCounter.Description(actions));
  nodes.register(ChainValue.Description(actions));
  nodes.register(ExternalTrigger.Description(actions));
}
