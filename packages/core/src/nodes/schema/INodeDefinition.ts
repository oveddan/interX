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

export type OutputValueSockets<T extends IHasSockets> = ValueSockets<OutputSockets<T>>;
export type InputValueSockets<T extends Pick<IHasSockets, 'inputSockets'>> = ValueSockets<InputSockets<T>>;
export type InputFlowSockets<T extends IHasSockets> = FlowSockets<InputSockets<T>>;
export type OutputFlowSockets<T extends Pick<IHasSockets, 'outputSockets'>> = FlowSockets<OutputSockets<T>>;

export type OutputValueType<T extends IHasSockets, J extends keyof OutputValueSockets<T>> = ExtractValueType<
  OutputValueSockets<T>,
  J
>;

export type InputValueType<T extends IHasSockets, J extends keyof InputValueSockets<T>> = ExtractValueType<
  InputValueSockets<T>,
  J
>;

export type readInputFn<T extends IHasSockets> = <J extends keyof InputValueSockets<T>>(
  param: J
) => InputValueType<T, J>;

export type writeOutputFn<THasSockets extends IHasSockets> = <J extends keyof OutputValueSockets<THasSockets>>(
  param: J,
  value: OutputValueType<THasSockets, J>
) => void;

export type commitFn<T extends IHasSockets> = <J extends keyof OutputFlowSockets<T>>(param: J) => void;

export type TriggeredParams<T extends IHasSockets> = {
  writeOutput: writeOutputFn<T>;
  readInput: readInputFn<T>;
  commit: commitFn<T>;
};

export type TriggeredFunction<T extends IHasSockets> = (params: TriggeredParams<T>) => void;

export interface IFlowNode<T extends IHasSockets> {
  socketsDefinition: T;
  triggered: (params: TriggeredParams<T>) => void;
}

export type NodeInputValues<T extends Pick<IHasSockets, 'inputSockets'>> = {
  [K in keyof InputValueSockets<T>]: ValueTypeNameMapping<InputValueSockets<T>[K]['valueType']>;
};

export type OutputFlowSocketNames<T extends Pick<IHasSockets, 'outputSockets'>> = keyof OutputFlowSockets<T>;

export function makeFlowNodeDefinition<T extends IHasSockets>(flowNode: IFlowNode<T>): IFlowNode<T> {
  return flowNode;
}
