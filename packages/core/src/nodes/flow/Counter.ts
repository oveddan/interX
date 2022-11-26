import { IHasSockets, makeFlowNodeDefinition } from "../schema/INodeDefinition";

export const counterSockets = {
  inputSockets: {
    flow: {
      valueType: 'flow'
    },
    reset: {
        valueType: 'flow'
    }
  }, 
  outputSockets: {
    flow: {
      valueType: 'flow',
    },
    count: {
      valueType: 'integer'
    }
  }
} satisfies IHasSockets;

export type CounterSocketsDefinition = typeof counterSockets;

const Counter = makeFlowNodeDefinition({
  socketsDefinition: counterSockets,
  triggered: ({
    commit,
    writeOutput,
    state
  }, triggeringSocketName) => {
    // duplicate count to not modify the state
    let count = state.count + 0n;
  
    switch (triggeringSocketName) {
      case 'flow': {
        count++;
        writeOutput('count', count);
        commit('flow');
        break;
      }
      case 'reset': {
        count = 0n;
        break;
      }
      default:
        throw new Error('should not get here');
    }
  
    return {
      count
    };
  },
  initialState: () => ({
    count: 0n
  })
});

export default Counter;