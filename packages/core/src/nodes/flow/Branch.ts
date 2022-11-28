import { makeFlowNodeDefinition } from '../schema/FlowNodes';

const Branch = makeFlowNodeDefinition({
  socketsDefinition: {
    inputSockets: {
      flow: {
        valueType: 'flow',
      },
      condition: {
        valueType: 'boolean',
      },
    },
    outputSockets: {
      true: {
        valueType: 'flow',
      },
      false: {
        valueType: 'flow',
      },
    },
  },
  triggered: ({ commit, readInput }) => {
    const value = readInput('condition');
    commit(value ? 'true' : 'false');
    return undefined;
  },
  initialState: () => undefined,
});

export default Branch;
