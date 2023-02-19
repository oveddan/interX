import { IScene } from '@behave-graph/core';

type IntVariableHandler = (value: bigint) => void;

export interface IChainGraph {
  invoke: (invokeId: number) => void;
  registerIntVariableValueListener: (id: string, cb: IntVariableHandler) => void;
  unRegisterIntVariableValueListener: (id: string, cb: IntVariableHandler) => void;
}

export interface IVariableStore {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  // registerOnValueChangedListener: (id: string, cb: (value: any) => void) => void;
  // removeOnValueChangedListener: (id: string, cb: (count: bigint) => void) => void;
}
