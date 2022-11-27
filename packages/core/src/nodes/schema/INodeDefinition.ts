import { NodeCategory } from '@behave-graph/core';

export type SocketValueType = 'flow' | 'boolean' | 'integer' | 'float' | 'string' | 'jsonPath';

export interface ISocketDefinition {
  readonly valueType: SocketValueType;
}

export type Sockets = {
  readonly [key: string]: ISocketDefinition;
};

export type IHasSockets = {
  readonly inputSockets: Sockets;
  readonly outputSockets: Sockets;
};

export interface INodeDefinition extends IHasSockets {
  typeName: string;
  category: NodeCategory;
  label: string;
}

export type ValueTypeNameMapping<K extends SocketValueType> = {
  
  boolean: boolean;
  integer: bigint;
  float: number;
  string: string;
  jsonPath: string;
  flow: void;
}[K];

export type OptionalValueTypeMapping<K extends SocketValueType> = ValueTypeNameMapping<K> | undefined;

type OutputSockets<T extends Pick<IHasSockets, 'outputSockets'>> = T['outputSockets'];
type InputSockets<T extends Pick<IHasSockets, 'inputSockets'>> = T['inputSockets'];

type FlowSocketDef = {
  valueType: 'flow';
};

export type ValueSockets<T extends Sockets> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends FlowSocketDef ? never : K }[keyof T]
>;
export type FlowSockets<T extends Sockets> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends FlowSocketDef ? K : never }[keyof T]
>;

export type ExtractValueType<T extends Sockets, K extends keyof T> = ValueTypeNameMapping<T[K]['valueType']>;

export type OutputValueSockets<T extends Pick<IHasSockets, 'outputSockets'>> = ValueSockets<OutputSockets<T>>;
export type InputValueSockets<T extends Pick<IHasSockets, 'inputSockets'>> = ValueSockets<InputSockets<T>>;
export type InputFlowSockets<T extends Pick<IHasSockets, 'inputSockets'>> = FlowSockets<InputSockets<T>>;
export type OutputFlowSockets<T extends Pick<IHasSockets, 'outputSockets'>> = FlowSockets<OutputSockets<T>>;

export type InputFlowSocketNames<T extends Pick<IHasSockets, 'inputSockets'>> = keyof InputFlowSockets<T>;
export type OutputFlowSocketNames<T extends Pick<IHasSockets, 'outputSockets'>> = keyof OutputFlowSockets<T>;
export type OutputValueSocketNames<T extends Pick<IHasSockets, 'outputSockets'>> = keyof OutputValueSockets<T>;

export type NodeInputValues<T extends Pick<IHasSockets, 'inputSockets'>> = {
  [K in keyof InputValueSockets<T>]?: ValueTypeNameMapping<InputValueSockets<T>[K]['valueType']>;
};

export type OutputValueType<T extends IHasSockets, J extends keyof OutputValueSockets<T>> = ExtractValueType<
  OutputValueSockets<T>,
  J
>;

export type InputValueType<T extends IHasSockets, J extends keyof InputValueSockets<T>> = ExtractValueType<
  InputValueSockets<T>,
  J
>;

/** Node Engine Access Functions */

export type readNodeInputFn<T extends IHasSockets> = <J extends keyof InputValueSockets<T>>(
  param: J
) => InputValueType<T, J> | undefined;

export type writeNodeOutputFn<THasSockets extends IHasSockets> = <J extends keyof OutputValueSockets<THasSockets>>(
  param: J,
  value: OutputValueType<THasSockets, J>
) => void;

export type commitFn<T extends IHasSockets> = <J extends keyof OutputFlowSockets<T>>(param: J) => void;

/** Flow Node Definitions */

export type ReadWriteToNodeParams<T extends IHasSockets> = {
  /** writes to an output node */
  writeOutput: writeNodeOutputFn<T>;
  /** reads a value from an input node */
  readInput: readNodeInputFn<T>;
}

/** Arguments for the triggered function on a flow node */
export type TriggeredParams<T extends IHasSockets, TNodeState> = ReadWriteToNodeParams<T> & {
  /** commits a trigger to a flow node */
  commit: commitFn<T>;
  /** The local node's state */
  readonly state: TNodeState;
  /** The name of the flow input socket that was triggered */
  triggeringSocketName: InputFlowSocketNames<T>;
};

export type TriggeredFunction<T extends IHasSockets, TNodeState> = (
  params: TriggeredParams<T, TNodeState>
) => TNodeState;

export interface IFlowNode<TSockets extends IHasSockets, TNodeState> {
  socketsDefinition: TSockets;
  /** Called when an input flow node is triggered */
  triggered: TriggeredFunction<TSockets, TNodeState>;
  initialState: () => TNodeState;
}
export function makeFlowNodeDefinition<TSockets extends IHasSockets, TNodeState = void>(
  flowNode: IFlowNode<TSockets, TNodeState>
): IFlowNode<TSockets, TNodeState> {
  return flowNode;
}

type ImmediateExecFn<T extends IHasSockets> = (
  params: ReadWriteToNodeParams<T>
) => void;

export interface IImmediateNode<T extends IHasSockets> {
  socketsDefinition: T;
  exec: ImmediateExecFn<T>;
}

export function makeImmediateNodeDefinition<T extends IHasSockets>(
  immediateNode: IImmediateNode<T>
) {
  return immediateNode;
}

export function makeIn1Out1FuncNode<TIn extends SocketValueType, TOut extends SocketValueType>({
  inputValueType,
  outputValueType,
  unaryEvalFunc,
}: {
  inputValueType: TIn;
  outputValueType: TOut;
  unaryEvalFunc: (a: ValueTypeNameMapping<TIn>) => ValueTypeNameMapping<TOut>;
}) {
  const socketsDefinition = {
    inputSockets: {
      a: {
        valueType: inputValueType,
      },
    },
    outputSockets: {
      result: {
        valueType: outputValueType,
      },
    },
  } satisfies IHasSockets;

  return makeImmediateNodeDefinition({
    socketsDefinition,
    exec: ({ readInput, writeOutput }) => {
      const input = readInput('a') as OptionalValueTypeMapping<TIn>;
      if (typeof input !== 'undefined') {
        writeOutput('result', unaryEvalFunc(input));
      }
    },
  });
}

// export const makeSocketsDefinition = <TInputSockets extends Sockets, TOutputSockets extends Sockets>(
//   hasSockets: IHasSockets<TInputSockets, TOutputSockets>
// ) => hasSockets;

function makeSockets<T extends Sockets>(sockets: T): T {
  return sockets;
}

export function makeIn2Out1FuncNode<
  TIn1 extends SocketValueType,
  TIn2 extends SocketValueType,
  TOut extends SocketValueType
>({
  inputValueTypes,
  outputValueType,
  unaryEvalFunc,
}: {
  inputValueTypes: [TIn1, TIn2];
  outputValueType: TOut;
  unaryEvalFunc: (a: ValueTypeNameMapping<TIn1>, b: ValueTypeNameMapping<TIn2>) => ValueTypeNameMapping<TOut>;
}) {
  const socketsDefinition  = {
    inputSockets: {
      a: {
        valueType: inputValueTypes[0],
      },
      b: {
        valueType: inputValueTypes[1],
      },
    },
    outputSockets: {
      result: {
        valueType: outputValueType,
      },
    },
  } satisfies IHasSockets;

  return makeImmediateNodeDefinition({
    socketsDefinition,
    exec: ({ readInput, writeOutput }) => {
      const inputA = readInput('a') as OptionalValueTypeMapping<TIn1>;
      const inputB = readInput('b') as OptionalValueTypeMapping<TIn2>;
      if (typeof inputA !== 'undefined' && typeof inputB !== 'undefined') {
        writeOutput('result', unaryEvalFunc(inputA, inputB));
      }
    },
  });
}


// type LengthOfArray<T extends Array<any>> = T.length;


type ValueTypeNameMappings<TValues extends [SocketValueType]
  | [SocketValueType, SocketValueType]
  | [SocketValueType, SocketValueType]
  | [SocketValueType, SocketValueType, SocketValueType]> = {
    [TValue in TValues]: 
  } 


export function makeInNOutNodes<
  TIn extends SocketValueType[],
  TOut extends SocketValueType
>({
  inputValueTypes,
  outputValueType,
  unaryEvalFunc,
}: {
  inputValueTypes: TIn
  outputValueType: TOut
  unaryEvalFunc: (...params: TIn) => ValueTypeNameMapping<TOut>;
}) {
  const socketsDefinition  = {
    inputSockets: {
      a: {
        valueType: inputValueTypes[0],
      },
      b: {
        valueType: inputValueTypes[1],
      },
    },
    outputSockets: {
      result: {
        valueType: outputValueType,
      },
    },
  } satisfies IHasSockets;

  return makeImmediateNodeDefinition({
    socketsDefinition,
    exec: ({ readInput, writeOutput }) => {
      const inputA = readInput('a') as OptionalValueTypeMapping<TIn1>;
      const inputB = readInput('b') as OptionalValueTypeMapping<TIn2>;
      if (typeof inputA !== 'undefined' && typeof inputB !== 'undefined') {
        writeOutput('result', unaryEvalFunc(inputA, inputB));
      }
    },
  });
}




// function recordFromEntries<K extends string, V>(entries: [K, V][]): Record<K, V> {
//   return Object.fromEntries(entries) as Record<K, V>;
// }

// function makeObjectExtractor(keyA: string) {
//   const fromEntries = recordFromEntries([[keyA, 4]]);
//   const toExtractFrom = {
//     keyB: 5,
//     ...recordFromEntries([[keyA, 4]]),
//   };

//   function getIncrementedVal(param: keyof typeof toExtractFrom) {
//     return toExtractFrom[param] + 1;
//   }

//   return getIncrementedVal;
// }

// const extractor = makeObjectExtractor('g');

// extractor('asdfasdf');
