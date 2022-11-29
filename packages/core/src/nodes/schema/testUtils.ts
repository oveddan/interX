import { IFlowNode, TriggeredParams } from './FlowNodes';
import { FlowSocketNames, Sockets, ValueSockets, ValueTypeNameMapping } from './Sockets';

/**
 * Assert parameter is of a specific type.
 *
 * @param value - Value that should be identical to type `T`.
 */
export function expectType<T>(value: T): void {}

type RecordedOutputWrite<TOutput extends Sockets> =
  | {
      writeType: 'flow';
      socketName: FlowSocketNames<TOutput>;
    }
  | {
      writeType: 'value';
      socketName: keyof ValueSockets<TOutput>;
      value: any;
    };

type NodeInputValues<TSockets extends Sockets> = {
  [K in keyof TSockets]?: ValueTypeNameMapping<TSockets[K]['valueType']>;
};

export type RecordedOutputWrites<T extends Sockets> = RecordedOutputWrite<T>[];

export const buildStubEngineForFlowNode = <TInput extends Sockets, TOutput extends Sockets, TState>(
  flowNodeDefinition: IFlowNode<TInput, TOutput, TState>
) => {
  const outputWrites: RecordedOutputWrites<TOutput> = [];

  const getOutputWrites = () => outputWrites;

  let inputValuesState: NodeInputValues<ValueSockets<TInput>> = {};

  const triggeredParams: Omit<TriggeredParams<TInput, TOutput, TState>, 'state' | 'triggeringSocketName'> = {
    commit: (param) => {
      outputWrites.push({
        writeType: 'flow',
        socketName: param,
      });
    },
    readInput: (param) => {
      // @ts-ignore
      return inputValuesState[param];
    },
    writeOutput: (param, value) => {
      outputWrites.push({
        writeType: 'value',
        // @ts-ignore
        socketName: param,
        value,
      });
    },
  };

  let nodeState = flowNodeDefinition.initialState();

  const trigger = (triggeringSocketName: FlowSocketNames<TInput>) => {
    // trigger node and update the state with the triggered result.
    const result = flowNodeDefinition.triggered({
      ...triggeredParams,
      state: nodeState,
      triggeringSocketName,
    });
    // if there is no node state, result will be undefined
    // so then we know that we dont need to update the node state
    if (typeof result !== 'undefined') nodeState = result;
  };

  const writeInput = <TValueSockets extends ValueSockets<TInput>, J extends keyof TValueSockets>(
    param: J,
    value: ValueTypeNameMapping<TValueSockets[J]['valueType']>
  ) => {
    // build fake write input fn that stores the write to an interval value store
    // @ts-ignore
    inputValuesState[param] = value;
  };

  return {
    getOutputWrites,
    trigger,
    writeInput,
  };
};
