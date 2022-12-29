import { makeFlowNodeDefinition, NodeCategory } from '@oveddan-behave-graph/core';
import { ChainNodeTypes, ChainValueType, makeChainNodeDefinition } from './IChainNode';

export const ChainVariableSet = makeFlowNodeDefinition({
  typeName: 'chain/intVariableSet',
  category: NodeCategory.Variable,
  label: 'Set On Chain Int Value',
  configuration: {
    variableId: {
      valueType: 'number',
    },
  },
  initialState: undefined,
  in: {
    flow: 'flow',
    value: 'integer',
  },
  out: {},
  triggered: () => {
    // doesnt actually do anything underneath, just triggers the flow on chain
    return undefined;
  },
});

export const onChainDefinition = makeChainNodeDefinition(ChainVariableSet, {
  nodeType: ChainNodeTypes.VariableSet,
  inputValueType: ChainValueType.Int,
  inSocketIds: {
    flow: 0,
    value: 1,
  },
  outSocketIds: {},
});
