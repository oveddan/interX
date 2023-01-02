import { makeEventNodeDefinition, NodeCategory, Variable } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, ChainValueType, makeChainSocketMapping } from './IChainNode';

const smartActionInvokedTypeName = 'chain/intVariableGet';
export const variableNameSocket = 'variableName';
export const valueSocketName = 'value';
const flowSocketName = 'flow';

type State = {
  handleValueUpdated?: (count: bigint) => void;
  variableId?: string;
};

const makeInitialState = (): State => ({});

export const chainGraphDependencyKey = 'chainGraph';

/**
 * Listens for chainges to an on-chain variable, and write the value to the output.
 * Commits the flow on each change.
 * This node isn't written tot he blockchain, as it just fetches the value via the subgraph.
 * @param smartContractActions
 * @returns
 */
export const OnChainVariableGet = makeEventNodeDefinition({
  typeName: smartActionInvokedTypeName,
  category: NodeCategory.Variable,
  label: 'Get On Chain Int Value',
  configuration: {
    variableId: {
      valueType: 'number',
    },
  },
  initialState: makeInitialState(),
  init: ({ write, commit, configuration, graph: { variables, getDependency } }) => {
    const variable = variables[configuration.variableId] || new Variable('-1', 'undefined', 'string', '');
    const variableId = variable.id;

    const handleValueUpdated = (count: bigint) => {
      write(valueSocketName, count);
      commit(flowSocketName);
    };
    const smartContractActions = getDependency<IChainGraph>(chainGraphDependencyKey);
    smartContractActions.registerIntVariableValueListener(variableId, handleValueUpdated);

    return {
      handleValueUpdated,
      variableId,
    };
  },
  dispose: ({ state, graph: { getDependency } }) => {
    if (state.handleValueUpdated && state.variableId) {
      const smartContractActions = getDependency<IChainGraph>(chainGraphDependencyKey);
      smartContractActions.unRegisterIntVariableValueListener(state.variableId, state.handleValueUpdated);
    }

    return {};
  },
  in: {
    [variableNameSocket]: 'string',
  },
  out: {
    [flowSocketName]: 'flow',
    [valueSocketName]: 'integer',
  },
});
