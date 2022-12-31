/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  HasVariables,
  HasVariablesInterface,
} from "../../../contracts/NodeState.sol/HasVariables";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "executor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "_variableId",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "value",
        type: "bool",
      },
    ],
    name: "BoolVariableUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "executor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "_variableId",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "value",
        type: "int256",
      },
    ],
    name: "IntVariableUpdated",
    type: "event",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220651c4f50530b6614753f817f82b3df34e6138c49a7aded2d10422c1ae1c5979a64736f6c63430008090033";

type HasVariablesConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HasVariablesConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HasVariables__factory extends ContractFactory {
  constructor(...args: HasVariablesConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<HasVariables> {
    return super.deploy(overrides || {}) as Promise<HasVariables>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): HasVariables {
    return super.attach(address) as HasVariables;
  }
  override connect(signer: Signer): HasVariables__factory {
    return super.connect(signer) as HasVariables__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HasVariablesInterface {
    return new utils.Interface(_abi) as HasVariablesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HasVariables {
    return new Contract(address, _abi, signerOrProvider) as HasVariables;
  }
}
