import { FlowNode, NodeCategory, Socket } from '@behave-graph/core';
import { UnionToIntersection } from 'type-fest';

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

export type readNodeInputFn<THasSockets extends IHasSockets> = <J extends keyof InputValueSockets<THasSockets>>(
  param: J
) => InputValueType<THasSockets, J>;

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

export type immediateReadIn<TSockets extends readonly SocketSpec[]> = <
  S extends Known<SocketsFromSpec<TSockets>>,
  K extends keyof S
>(
  key: K
) => S[K];

export type immediateWriteOut<TSocket extends SocketSpec> = (
  key: TSocket['name'],
  value: ValueTypeNameMapping<TSocket['valueType']>
) => void;

type ImmediateExecParams<TIn extends readonly SocketSpec[], TOut extends SocketSpec> = {
  readInput: immediateReadIn<TIn>;
  writeOutput: immediateWriteOut<TOut>;
};

type ImmediateExecFn<TIn extends readonly SocketSpec[], TOut extends SocketSpec> = (
  params: ImmediateExecParams<TIn, TOut>
) => void;

export interface IImmediateNode<TIn extends readonly SocketSpec[], TOut extends SocketSpec> {
  socketsDefinition: IHasSockets;
  exec: ImmediateExecFn<TIn, TOut>;
}

function makeImmediateNodeDefinition<TIn extends SocketSpec[], TOut extends SocketSpec>(
  node: IImmediateNode<TIn, TOut>
) {
  return node;
}

export type SocketValueTypes<T extends readonly SocketSpec[]> = {
  [K in keyof T]: ValueTypeNameMapping<T[K]['valueType']>;
};

type unaryEvalFunction<TInput extends readonly SocketSpec[], TOutput extends SocketSpec> = (
  ...params: SocketValueTypes<TInput>
) => ValueTypeNameMapping<TOutput['valueType']>;

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

export type SocketsFromSpec<T extends readonly SocketSpec[]> = Known<UnionToIntersection<ToObjectsArray<T>[number]>>;

export function makeSocketsFromSpec<TSockets extends readonly SocketSpec[]>(socketSpecs: TSockets) {
  const sockets: any = {};

  for (const { name, valueType } of socketSpecs) {
    sockets[name] = { valueType } satisfies ISocketDefinition;
  }

  return sockets as SocketsFromSpec<TSockets>;
}

export function makeImmediateInNOutNode<TIn extends readonly SocketSpec[], TOut extends SocketSpec>({
  inputValueTypes,
  outputValueType,
  unaryEvalFunc,
}: {
  inputValueTypes: TIn;
  outputValueType: TOut;
  unaryEvalFunc: unaryEvalFunction<TIn, TOut>;
}): IImmediateNode<TIn, TOut> {
  const inputSockets = makeSocketsFromSpec(inputValueTypes) satisfies Sockets;
  const outputSockets = makeSocketsFromSpec([outputValueType]) satisfies Sockets;

  // const x: immediateReadIn<typeof inputValueTypes> = (param) => {};

  const exec: ImmediateExecFn<TIn, TOut> = ({ readInput, writeOutput }) => {
    // let args: any[] = [];
    const names = inputValueTypes.map(({ name }) => name) as SocketNames<TIn>;

    const inputValues = names.map((x) => readInput(x)) as unknown as SocketValueTypes<TIn>;

    const result = unaryEvalFunc(...inputValues);

    writeOutput(outputValueType['name'], result);
  };

  return makeImmediateNodeDefinition({
    socketsDefinition: {
      inputSockets,
      outputSockets,
    },
    exec,
  });
}
