import { IFlowNode, IHasSockets, ISocketDefinition, makeFlowNodeDefinition, TriggeredFunction } from "../schema/INodeDefinition";

// [new Socket('flow', 'flow'), new Socket('boolean', 'condition')],
//       [new Socket('flow', 'true'), new Socket('flow', 'false')]
//     );

export const branchSockets = {
  inputSockets: {
    flow: {
      valueType: 'flow'
    },
    condition: {
      valueType: 'boolean'
    }
  },
  outputSockets: {
    true: {
      valueType: 'flow'
    },
    false: {
      valueType: 'flow'
    }
  }
} satisfies IHasSockets; 

export type BranchSocketsDefinition = typeof branchSockets;
export type BranchState = undefined;

const Branch = makeFlowNodeDefinition<BranchSocketsDefinition, BranchState>({
  socketsDefinition: branchSockets,
  triggered: ({
    commit,
    readInput
  }) => {
    const value = readInput('condition');
    commit(value ? 'true' : 'false')
    return undefined;
  },
  initialState: () => undefined
}) satisfies IFlowNode<BranchSocketsDefinition, BranchState>;

export default Branch;