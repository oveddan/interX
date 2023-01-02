import { IScene } from '@behave-graph/core';

type IntVariableHandler = (value: bigint) => void;

export interface IChainGraph {
  invoke: (invokeId: number) => void;
  registerIntVariableValueListener: (id: string, cb: IntVariableHandler) => void;
  unRegisterIntVariableValueListener: (id: string, cb: IntVariableHandler) => void;
}

export type ResourceOption = {
  name: string;
  index: number;
};

export type ResourceProperties = {
  options: ResourceOption[];
  properties: string[];
};

export type ResourceTypes = 'nodes' | 'materials' | 'animations';

export type Properties = {
  nodes?: ResourceProperties;
  materials?: ResourceProperties;
  animations?: ResourceProperties;
};

export interface ISceneWithQueries extends IScene {
  getProperties: () => Properties;
  removeOnClickedListener(jsonPath: string, callback: (jsonPath: string) => void): void;
}

export interface IVariableStore {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  // registerOnValueChangedListener: (id: string, cb: (value: any) => void) => void;
  // removeOnValueChangedListener: (id: string, cb: (count: bigint) => void) => void;
}
