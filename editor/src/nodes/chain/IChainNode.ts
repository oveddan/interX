import { ExtractAbiFunction, ExtractAbiFunctionNames, narrow, AbiParametersToPrimitiveTypes } from 'abitype';
import { abi } from '../../contracts/abi';

type SafeMintFunction = ExtractAbiFunction<typeof abi, 'safeMint'>;

export type SafeMintInputs = AbiParametersToPrimitiveTypes<SafeMintFunction['inputs']>;

export type ChainNodeDefinition = SafeMintInputs[1][0];
export type ChainEdgeNodeDefinition = SafeMintInputs[2][0];

export type ChainNodeSpec = Pick<ChainNodeDefinition, 'nodeType' | 'inputValueType'>;

export enum ChainNodeTypes {
  ExternalTrigger = 0,
  Counter = 1,
  Add = 2,
  Gate = 3,
  VariableSet = 4,
}

export enum ChainValueType {
  Int = 0,
  Bool = 1,
  NotAVariable = 2,
}

export interface IChainNode {
  id: string;
  toNodeDefinition: () => ChainNodeSpec;
}