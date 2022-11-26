/**
 * Assert parameter is of a specific type.
 *
 * @param value - Value that should be identical to type `T`.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import {
  ExtractValueType,
  IFlowNode,
  IHasSockets,
  InputFlowSocketNames,
  InputValueSockets,
  InputValueType,
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

export const buildStubEngineForFlowNode = <TSockets extends IHasSockets, TState>(
  flowNodeDefinition: IFlowNode<TSockets, TState>
) => {
  const outputWrites: RecordedOutputWrites<TSockets> = [];

  const getOutputWrites = () => outputWrites;

  let inputValuesState: NodeInputValues<TSockets> = {};

  const triggeredParams: Omit<TriggeredParams<TSockets, TState>, 'state'> = {
    commit: (param) => {
      outputWrites.push({
        writeType: 'flow',
        socketName: param,
      });
    },
    readInput: (param) => {
      return inputValuesState[param];
    },
    writeOutput: (param, value) => {
      outputWrites.push({
        writeType: 'value',
        socketName: param,
        value,
      });
    },
  };

  let nodeState = flowNodeDefinition.initialState();

  const trigger = (nodeName: InputFlowSocketNames<TSockets>) => {
    // trigger node and update the state with the triggered result.
    nodeState = flowNodeDefinition.triggered(
      {
        ...triggeredParams,
        state: nodeState,
      },
      nodeName
    );
  };

  const writeInput = <J extends keyof InputValueSockets<TSockets>>(param: J, value: InputValueType<TSockets, J>) => {
    inputValuesState[param] = value;
  };

  return {
    getOutputWrites,
    trigger,
    writeInput,
  };
};
