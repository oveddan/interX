import { makeFlowNodeDefinition, NodeCategory } from '@oveddan-behave-graph/core';
import { ChainNodeTypes, ChainValueType, makeChainSocketMapping } from './IChainNode';

const chainCounterLocal = makeFlowNodeDefinition({
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

/**
 * An on-chain counter that increments on each flow.
 */
export const OnChainCounter = makeChainSocketMapping(chainCounterLocal, {
  nodeType: ChainNodeTypes.Counter,
  inputValueType: ChainValueType.Int,
  socketIdKey: 'counter',
  socketMappings: {
    in: {
      flow: 'inputFlow',
    },
    out: {
      flow: 'outputFlow',
      count: 'outputCount',
    },
  },
});
