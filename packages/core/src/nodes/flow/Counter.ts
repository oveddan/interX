import { IFlowNode, IHasSockets, makeFlowNodeDefinition } from "../schema/INodeDefinition";

// [new Socket('flow', 'flow'), new Socket('flow', 'reset')],
// [new Socket('flow', 'flow'), new Socket('integer', 'count')]

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

let count = 0n;

const Counter = makeFlowNodeDefinition({
  socketsDefinition: counterSockets,
  triggered: ({
    commit,
    writeOutput
  }, triggeringSocketName) => {
  
    switch (triggeringSocketName) {
      case 'flow': {
        count++;
        writeOutput('count', count);
        commit('flow');
        break;
      }
      case 'reset': {
        count++;
        break;
      }
      default:
        throw new Error('should not get here');
    }
  }
});

export default Counter;