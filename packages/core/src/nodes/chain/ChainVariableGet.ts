import { makeEventNodeDefinition, NodeCategory, Variable } from '@oveddan-behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, ChainValueType, makeChainNodeDefinition } from './IChainNode';

const smartActionInvokedTypeName = 'chain/intVariableGet';
export const variableNameSocket = 'variableName';
export const valueSocketName = 'value';
const flowSocketName = 'flow';

type State = {
  handleValueUpdated?: (count: bigint) => void;
  variableId?: string;
};

const makeInitialState = (): State => ({});

// this doesnt need to go on chain, because it is just fetching
export const ChainVariableGet = (smartContractActions: IChainGraph) =>
  makeEventNodeDefinition({
    typeName: smartActionInvokedTypeName,
    category: NodeCategory.Variable,
    label: 'Get On Chain Int Value',
    configuration: {
      variableId: {
        valueType: 'number',
      },
    },
    initialState: makeInitialState(),
    init: ({ write, commit, configuration, graph: { variables } }) => {
      const variable = variables[configuration.variableId] || new Variable('-1', 'undefined', 'string', '');
      const variableId = variable.id;

      const handleValueUpdated = (count: bigint) => {
        write(valueSocketName, count);
        commit(flowSocketName);
      };
      smartContractActions.registerIntVariableValueListener(variableId, handleValueUpdated);

      return {
        handleValueUpdated,
        variableId,
      };
    },
    dispose: ({ state }) => {
      if (state.handleValueUpdated && state.variableId) {
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
