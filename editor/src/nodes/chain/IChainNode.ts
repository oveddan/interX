export enum ChainNodeTypes {
  ExternalTrigger = 0,
  Counter = 1,
  Add = 2,
  Gate = 3,
  Value = 4,
}

export interface IChainNode {
  id: string;
  readonly chainNodeType: ChainNodeTypes;
}
