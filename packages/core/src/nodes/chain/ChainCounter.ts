import { makeFlowNodeDefinition, NodeCategory } from '@oveddan-behave-graph/core';
import { ChainNodeTypes, ChainValueType, makeChainNodeDefinition } from './IChainNode';

export const ChainCounter = makeFlowNodeDefinition({
  typeName: 'chain/counter',
  category: NodeCategory.Flow,
  label: 'Chain Counter',
  initialState: undefined,
  in: {
    flow: 'flow',
  },
  out: {
    flow: 'flow',
    count: 'integer',
  },
  triggered: () => {
    return undefined;
  },
});

export const onChainDefinition = makeChainNodeDefinition(ChainCounter, {
  nodeType: ChainNodeTypes.Counter,
  inputValueType: ChainValueType.Int,
  inSocketIds: {
    flow: 0,
  },
  outSocketIds: {
    flow: 1,
    count: 2,
  },
});
