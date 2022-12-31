/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export type GraphUpdateStruct = {
  updateType: PromiseOrValue<BigNumberish>;
  variableId: PromiseOrValue<BigNumberish>;
  intValue: PromiseOrValue<BigNumberish>;
  boolValue: PromiseOrValue<boolean>;
};

export type GraphUpdateStructOutput = [number, number, BigNumber, boolean] & {
  updateType: number;
  variableId: number;
  intValue: BigNumber;
  boolValue: boolean;
};

export interface ITriggerNodeInterface extends utils.Interface {
  functions: {
    "trigger(address,uint16,uint8)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "trigger"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "trigger",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "trigger", data: BytesLike): Result;

  events: {};
}

export interface ITriggerNode extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITriggerNodeInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    trigger(
      _behaviorGraph: PromiseOrValue<string>,
      _nodeId: PromiseOrValue<BigNumberish>,
      _triggeringSocketIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  trigger(
    _behaviorGraph: PromiseOrValue<string>,
    _nodeId: PromiseOrValue<BigNumberish>,
    _triggeringSocketIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    trigger(
      _behaviorGraph: PromiseOrValue<string>,
      _nodeId: PromiseOrValue<BigNumberish>,
      _triggeringSocketIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<GraphUpdateStructOutput[]>;
  };

  filters: {};

  estimateGas: {
    trigger(
      _behaviorGraph: PromiseOrValue<string>,
      _nodeId: PromiseOrValue<BigNumberish>,
      _triggeringSocketIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    trigger(
      _behaviorGraph: PromiseOrValue<string>,
      _nodeId: PromiseOrValue<BigNumberish>,
      _triggeringSocketIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
