import { FlowNode, NodeCategory, Socket } from '@behave-graph/core';
import { UnionToIntersection } from 'type-fest';

export type SocketValueType = 'flow' | 'boolean' | 'integer' | 'float' | 'string' | 'jsonPath';

export interface ISocketDefinition {
  readonly name: string;
  readonly valueType: SocketValueType;
}

export type Sockets = readonly ISocketDefinition[];

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

export type ValueSockets<T extends Sockets> = {
  [K in keyof T]-?: T[K] extends FlowSocketDef ? never : T[K];
};
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

export type readNodeInputFn<T extends IHasSockets> = <TIn extends InputValueSockets<T>[number], J extends keyof TIn>(
  param: TIn[number][J]
) => undefined;

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
};

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

type ImmediateExecFn<T extends IHasSockets> = (params: ReadWriteToNodeParams<T>) => void;

export interface IImmediateNode<T extends IHasSockets> {
  socketsDefinition: T;
  exec: ImmediateExecFn<T>;
}

export function makeImmediateNodeDefinition<T extends IHasSockets>(immediateNode: IImmediateNode<T>) {
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

// type LengthOfArray<T extends Array<any>> = T.length;

// type ValueTypeMapping = {
//   "string": string,
//   "boolean": boolean,
//   "float": number,
//   "integer": number
// }

// type ValueType = keyof ValueTypeMapping;

type ValuesForValueTypes<T extends readonly SocketSpec[]> = {
  [K in keyof T]: ValueTypeNameMapping<T[K]['valueType']>;
};

type unaryEvalFunction<TInput extends readonly SocketSpec[], TOutput extends SocketSpec> = (
  ...params: ValuesForValueTypes<TInput>
) => ValueTypeNameMapping<TOutput['valueType']>;

// type SocketSpec = [string, SocketValueType];

// type ValueTypeFromSockets<T extends SocketSpec[]> = {
//   [V in keyof T]: T[V]['valueType']
// }

// type ToObject<T> = T extends readonly [infer Key, infer Func]
//   ? Key extends PropertyKey
//     ? { [P in Key]: Func }
//     : never
//   : never;

// type ToObjectsArray<T> = {
//   [I in keyof T]: ToObject<T[I]>;
// };

// type UnionToIntersection<U> =
//   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type SocketSpec = {
  name: string;
  valueType: SocketValueType;
};

export type SocketNames<T extends readonly SocketSpec[]> = {
  [K in keyof T]: T[K]['name'];
};

type ToSocket<T extends SocketSpec> = {
  [P in T['name']]: {
    valueType: T['valueType'];
  };
};

export type ToObjectsArray<T extends readonly SocketSpec[]> = {
  [I in keyof T]: ToSocket<T[I]>;
};

type Known<T extends any | unknown | never> = Exclude<T, unknown | never>;

// export type UnionToIntersection<Union> = // `extends unknown` is always going to be the case and is used to convert the
//   // `Union` into a [distributive conditional
//   // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
//   (
//     Union extends unknown
//       ? // The union type is used as the only argument to a function since the union
//         // of function arguments is an intersection.
//         (distributedUnion: Union) => void
//       : // This won't happen.
//         never
//   ) extends // Infer the `Intersection` type since TypeScript represents the positional
//   // arguments of unions of functions as an intersection of the union.
//   (mergedIntersection: infer Intersection) => void
//     ? Intersection
//     : never;

export type SocketsFromSpec<T extends readonly SocketSpec[]> = Known<UnionToIntersection<ToObjectsArray<T>[number]>>;

// type Params = [{ name: 'a'; valueType: 'float' }, { name: 'b'; valueType: 'string' }];

// type mapped = SocketsFromSpec<Params>;

// type x = mapped['a'];

// type SocketsForSpec<T extends readonly SocketSpec[]> = T extends readonly [infer Key, infer SocketValueType]
//   ? Key extends PropertyKey
//     ? { [P in Key]: SocketValueType }
//     : never
//   : never;

// type SocketsForSpec<T extends readonly SocketSpec[]> = {
//   [V in keyof T as `${V}`]: T[V]['valueType']
// }

// type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
// type MapValue<BaseType> = BaseType extends Map<unknown, infer ValueType> ? ValueType : never;
// type MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
// type Entries<T extends { [key: string]: SocketValueType }> = Array<MapEntry<T>>

// type SocketsForValuesType<T extends { [key: string]: SocketValueType }, J = Entries<T>> = {
//   [K in keyof J]: J[K]
// }

// type x = SocketsForValuesType<{
//   a: 'string',
//   b: 'float'
// }>;

// test

// const fn: unaryEvalFunction<['string', 'float'], 'float'> = (a, b) => {
//   return 5;
// };

export function makeSocketsFromSpec<TSockets extends readonly SocketSpec[]>(socketSpecs: TSockets) {
  const sockets: any = {};

  for (const { name, valueType } of socketSpecs) {
    sockets[name] = { valueType } satisfies ISocketDefinition;
  }

  return sockets as SocketsFromSpec<TSockets>;
}

type immediateReadIn<TSockets extends SocketSpec[]> = <socket extends TSockets[number]>(
  key: socket['name']
) => ValueTypeNameMapping<socket['valueType']>;

export function makeInNOutNodes<TIn extends readonly SocketSpec[], TOut extends SocketSpec>({
  inputValueTypes,
  outputValueType,
  unaryEvalFunc,
}: {
  inputValueTypes: TIn;
  outputValueType: TOut;
  unaryEvalFunc: unaryEvalFunction<TIn, TOut>;
}) {
  const inputSockets = makeSocketsFromSpec(inputValueTypes) satisfies Sockets;
  const outputSockets = makeSocketsFromSpec([outputValueType]) satisfies Sockets;

  return makeImmediateNodeDefinition({
    socketsDefinition: {
      inputSockets,
      outputSockets,
    },
    exec: ({ readInput, writeOutput }) => {
      const iputVals: any[] = [];

      // if (inputValueTypes.length > 0) {
      // const firstName = inputValueTypes[0].name;
      //  readInput(firstName)
      for (const { name } of inputValueTypes) {
        const x = name satisfies keyof typeof inputSockets;

        const inputVal = readInput(name satisfies keyof typeof inputSockets);
        // }
      }

      const inputVals = [inputType in inputValueTypes];
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

// type FnForSpecific = (...params: ForSpecific) => {

// }

// type ValuesForValueTypes<T extends ValueType[]> = [
//   [K in T]: ValueTypeMapping[K]
// ]
