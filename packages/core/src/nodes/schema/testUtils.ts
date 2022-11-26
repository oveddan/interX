/**
 * Assert parameter is of a specific type.
 *
 * @param value - Value that should be identical to type `T`.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import {
  IHasSockets,
  NodeInputValues,
  OutputFlowSocketNames,
  OutputFlowSockets,
  OutputValueSocketNames,
  TriggeredParams,
} from './INodeDefinition';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expectType<T>(value: T): void {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}

type RecordedOutputWrite<T extends IHasSockets> =
  | {
      writeType: 'flow';
      socketName: OutputFlowSocketNames<T>;
    }
  | {
      writeType: 'value';
      socketName: OutputValueSocketNames<T>;
      value: any;
    };

export type RecordedOutputWrites<T extends IHasSockets> = RecordedOutputWrite<T>[];

export const buildStubbedTriggeredInvoker = <T extends IHasSockets>(mockState: NodeInputValues<T>) => {
  const outputWrites: RecordedOutputWrites<T> = [];

  const getCommitedNodes = () => outputWrites;

  const triggeredParams: TriggeredParams<T> = {
    commit: (param) => {
      outputWrites.push({
        writeType: 'flow',
        socketName: param,
      });
    },
    readInput: (param) => {
      return mockState[param];
    },
    writeOutput: (param, value) => {
      outputWrites.push({
        writeType: 'value',
        socketName: param,
        value,
      });
    },
  };

  return {
    triggeredParams,
    getCommitedNodes,
  };
};
