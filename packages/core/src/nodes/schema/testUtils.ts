/**
 * Assert parameter is of a specific type.
 *
 * @param value - Value that should be identical to type `T`.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { IHasSockets, NodeInputValues, OutputFlowSocketNames, TriggeredParams } from './INodeDefinition';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expectType<T>(value: T): void {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}

export const buildStubbedTriggeredInvoker = <T extends IHasSockets>(mockState: NodeInputValues<T>) => {
  const committedNodes: OutputFlowSocketNames<T>[] = [];

  const getCommitedNodes = () => committedNodes;

  const triggeredParams: TriggeredParams<T> = {
    commit: (param) => {
      committedNodes.push(param);
    },
    readInput: (param) => {
      return mockState[param];
    },
    writeOutput: () => {
      throw new Error('not implemented');
    },
  };

  return {
    triggeredParams,
    getCommitedNodes,
  };
};
