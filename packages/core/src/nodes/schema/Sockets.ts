import { UnionToIntersection } from 'type-fest';

export type SocketValueType = 'flow' | 'boolean' | 'integer' | 'float' | 'string' | 'jsonPath';

export type ValueTypeNameMapping<K extends SocketValueType> = {
  boolean: boolean;
  integer: bigint;
  float: number;
  string: string;
  jsonPath: string;
  flow: void;
}[K];

export type OptionalValueTypeMapping<K extends SocketValueType> = ValueTypeNameMapping<K> | undefined;

export interface ISocketDefinition {
  readonly valueType: SocketValueType;
}

export type Sockets = {
  readonly [key: string]: ISocketDefinition;
};

export type OutputSockets<T extends Pick<IHasSockets, 'outputSockets'>> = T['outputSockets'];
export type InputSockets<T extends Pick<IHasSockets, 'inputSockets'>> = T['inputSockets'];

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

/** IHasSockets Utils */

export type IHasSockets = {
  readonly inputSockets: Sockets;
  readonly outputSockets: Sockets;
};

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

export type SocketValueTypes<T extends readonly SocketSpec[]> = {
  [K in keyof T]: ValueTypeNameMapping<T[K]['valueType']>;
};

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

export type Known<T extends any | unknown | never> = Exclude<T, unknown | never>;

export type SocketsFromSpec<T extends readonly SocketSpec[]> = Known<UnionToIntersection<ToObjectsArray<T>[number]>>;

export function makeSocketsFromSpec<TSockets extends readonly SocketSpec[]>(socketSpecs: TSockets) {
  const sockets: any = {};

  for (const { name, valueType } of socketSpecs) {
    sockets[name] = { valueType } satisfies ISocketDefinition;
  }

  return sockets as SocketsFromSpec<TSockets>;
}
