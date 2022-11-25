import { NodeCategory } from '@behave-graph/core';

export type SocketValueType = 'flow' | 'boolean' | 'integer' | 'float' | 'string';

export interface ISocketDefinition {
  valueType: SocketValueType;
}

export type IHasSockets = {
  inputSockets: {
    [key: string]: ISocketDefinition;
  } 
  ouptutSockets: {
    [key: string]: ISocketDefinition;
  }
}

export interface INodeDefinition extends IHasSockets {
  typeName: string,
  category: NodeCategory,     
  label: string,
}

export type OutputSockets<T extends IHasSockets> = T["ouptutSockets"];

export type TriggeredParams<T extends IHasSockets> = {
  writeOutput: <J extends keyof OutputSockets<T>>(param: J, value: any) => void,
  readInput: <T>(param: string) => T,
  commit: (param: string) => void,
};

export interface IFlowNode<T extends INodeDefinition>  {
  definition: T;
  triggered: (params: TriggeredParams<T>) => void;
}