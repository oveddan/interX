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

/** Arguments for the triggered function on a flow node */
export type TriggeredParams<T extends IHasSockets, TNodeState> = {
  /** writes to an output node */
  writeOutput: writeNodeOutputFn<T>;
  /** reads a value from an input node */
  readInput: readNodeInputFn<T>;
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
