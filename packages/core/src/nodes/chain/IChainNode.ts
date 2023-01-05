import {
  IHasTriggered,
  INodeDefinition,
  NodeConfiguration,
  NodeConfigurationDescription,
  Socket,
  SocketNames,
  SocketsDefinition,
} from '@oveddan-behave-graph/core';
import { ExtractAbiFunction, AbiParametersToPrimitiveTypes } from 'abitype';
import {
  CounterSocketIndecesStruct,
  SocketIndecesByNodeTypeStruct,
} from 'typechain-types/contracts/BehaviorGraphToken';
import { abi } from '../../contracts/abi';

type SafeMintFunction = ExtractAbiFunction<typeof abi, 'safeMint'>;

export type SafeMintInputs = AbiParametersToPrimitiveTypes<SafeMintFunction['inputs']>;

export type ChainNodeDefinitionAndValues = SafeMintInputs[1][0];
export type ChainEdgeNodeDefinition = SafeMintInputs[2][0];

export type ChainNodeDefinition = ChainNodeDefinitionAndValues['definition'];
export type ChainnInitialValues = ChainNodeDefinitionAndValues['initialValues'];

export type ChainNodeSpec = Pick<ChainNodeDefinition, 'nodeType' | 'inputValueType'>;

type SocketIndecesByNodeTypeFunction = ExtractAbiFunction<typeof abi, 'getSocketIndecesByNodeType'>;
export type SocketIndecesByNodeType = AbiParametersToPrimitiveTypes<SocketIndecesByNodeTypeFunction['outputs']>[0];

export enum ChainNodeTypes {
  ExternalInvoke = 0,
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

export type ChainNodeConfig = ChainNodeDefinitionAndValues['config'];

export const emptyNodeConfig: ChainNodeConfig = {
  invocationId: 0,
  invocationNameDefined: false,
  variableId: 0,
  variableIdDefined: false,
};

export type SocketMappings<
  TSockets extends SocketsDefinition,
  TSocketIdKey extends keyof SocketIndecesByNodeTypeStruct
> = {
  [key in SocketNames<TSockets>]?: keyof SocketIndecesByNodeType[TSocketIdKey];
};

export type ToOnChainDefinitionForNode<
  TInput extends SocketsDefinition = SocketsDefinition,
  TOutput extends SocketsDefinition = SocketsDefinition,
  TSocketIdKey extends keyof SocketIndecesByNodeTypeStruct = 'externalInvoke'
> = {
  nodeType: ChainNodeTypes;
  inputValueType: ChainValueType;
  socketIdKey: TSocketIdKey;
  getConfig?: (config: NodeConfiguration | undefined) => Partial<ChainNodeConfig>;
  socketMappings: {
    out?: SocketMappings<TOutput, TSocketIdKey>;
    in?: SocketMappings<TInput, TSocketIdKey>;
  };
};

type SocketIdValue = CounterSocketIndecesStruct['inputFlow'];

export type SocketIds = Record<string, SocketIdValue>;

export interface IHasOnChainDefinition<
  TInput extends SocketsDefinition = SocketsDefinition,
  TOutput extends SocketsDefinition = SocketsDefinition,
  TSocketIdKey extends keyof SocketIndecesByNodeTypeStruct = any
> {
  chain: ToOnChainDefinitionForNode<TInput, TOutput, TSocketIdKey>;
}

export const makeChainSocketMapping = <
  TInput extends SocketsDefinition,
  TOutput extends SocketsDefinition,
  TConfig extends NodeConfigurationDescription,
  TSocketIdKey extends keyof SocketIndecesByNodeTypeStruct
>(
  definition: INodeDefinition<TInput, TOutput, TConfig>,
  chain: ToOnChainDefinitionForNode<TInput, TOutput, TSocketIdKey>
) => ({
  ...definition,
  chain,
});

export interface IHasOnChainTrigger<TInput extends SocketsDefinition, TOutput extends SocketsDefinition, TState>
  extends IHasTriggered<TInput, TOutput, TState> {}

export type ChainNodeDefinitions = {
  [key in ChainNodeTypes]: {};
};

export class SocketWithChainIndex extends Socket {
  constructor(valueType: string, name: string, public readonly chainIndex: number) {
    super(valueType, name, chainIndex);
  }
}
