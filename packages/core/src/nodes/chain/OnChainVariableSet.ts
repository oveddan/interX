import { makeFlowNodeDefinition, NodeCategory } from '@oveddan-behave-graph/core';
import { ChainNodeTypes, ChainValueType, makeChainSocketMapping } from './IChainNode';

export const chainVariableSet = makeFlowNodeDefinition({
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

/**
 * Sets an on-chain variable to a value.
 */
export const OnChainVariableSet = makeChainSocketMapping(chainVariableSet, {
  nodeType: ChainNodeTypes.VariableSet,
  inputValueType: ChainValueType.Int,
  getConfig: (configuration) => ({
    variableId: configuration?.variableId || 1,
    variableIdDefined: true,
  }),
  socketIdKey: 'variableSet',
  socketMappings: {
    in: {
      flow: 'inputFlow',
      value: 'inputVal',
    },
  },
});
