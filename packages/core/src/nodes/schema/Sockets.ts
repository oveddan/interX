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

export type ValueTypeMappings<SocketValueTypes extends readonly SocketValueType[]> = {
  [K in keyof SocketValueTypes]: ValueTypeNameMapping<SocketValueTypes[K]>;
};

export type OptionalValueTypeMapping<K extends SocketValueType> = ValueTypeNameMapping<K> | undefined;

export interface ISocketDefinition {
  readonly valueType: SocketValueType;
}

export type Sockets = {
  readonly [key: string]: ISocketDefinition;
};

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

export type FlowSocketNames<T extends Sockets> = keyof FlowSockets<T>;

/** IHasSockets Utils */

export type IHasSockets<TInputSockets extends Sockets, TOutputSockets extends Sockets> = {
  readonly inputSockets: TInputSockets;
  readonly outputSockets: TOutputSockets;
};

export type ExtractValueType<T extends Sockets, K extends keyof T> = ValueTypeNameMapping<T[K]['valueType']>;

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
