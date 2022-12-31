/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  VariableSet,
  VariableSetInterface,
  VariableSetIndecesStruct,
} from "../../../contracts/Nodes.sol/VariableSet";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "inputFlow",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "inputVal",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "variableName",
            type: "uint8",
          },
        ],
        internalType: "struct VariableSetIndeces",
        name: "socketIndeces",
        type: "tuple",
      },
      {
        internalType: "uint8",
        name: "variableId",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "contract IBehaviorGraph",
        name: "_behaviorGraph",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_nodeId",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "_triggeringSocketIndex",
        type: "uint8",
      },
    ],
    name: "trigger",
    outputs: [
      {
        components: [
          {
            internalType: "enum UpdateType",
            name: "updateType",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "variableId",
            type: "uint8",
          },
          {
            internalType: "int256",
            name: "intValue",
            type: "int256",
          },
          {
            internalType: "bool",
            name: "boolValue",
            type: "bool",
          },
        ],
        internalType: "struct GraphUpdate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000ba438038062000ba4833981810160405281019062000037919062000218565b816000808201518160000160006101000a81548160ff021916908360ff16021790555060208201518160000160016101000a81548160ff021916908360ff16021790555060408201518160000160026101000a81548160ff021916908360ff16021790555090505080600160006101000a81548160ff021916908360ff16021790555050506200025f565b6000604051905090565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200012182620000d6565b810181811067ffffffffffffffff82111715620001435762000142620000e7565b5b80604052505050565b600062000158620000c2565b905062000166828262000116565b919050565b600060ff82169050919050565b62000183816200016b565b81146200018f57600080fd5b50565b600081519050620001a38162000178565b92915050565b600060608284031215620001c257620001c1620000d1565b5b620001ce60606200014c565b90506000620001e08482850162000192565b6000830152506020620001f68482850162000192565b60208301525060406200020c8482850162000192565b60408301525092915050565b60008060808385031215620002325762000231620000cc565b5b60006200024285828601620001a9565b9250506060620002558582860162000192565b9150509250929050565b610935806200026f6000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063bc25907114610030575b600080fd5b61004a60048036038101906100459190610508565b610060565b6040516100579190610719565b60405180910390f35b606060008473ffffffffffffffffffffffffffffffffffffffff1663d8ac0519856040518263ffffffff1660e01b815260040161009d919061074a565b60206040518083038186803b1580156100b557600080fd5b505afa1580156100c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100ed919061078a565b90506000600167ffffffffffffffff81111561010c5761010b6107b7565b5b60405190808252806020026020018201604052801561014557816020015b6101326103e1565b81526020019060019003908161012a5790505b509050600160009054906101000a900460ff168160008151811061016c5761016b6107e6565b5b60200260200101516020019060ff16908160ff16815250506000600281111561019857610197610587565b5b8260028111156101ab576101aa610587565b5b14156102c2576000816000815181106101c7576101c66107e6565b5b60200260200101516000019060018111156101e5576101e4610587565b5b908160018111156101f9576101f8610587565b5b815250508573ffffffffffffffffffffffffffffffffffffffff16631225974f866000800160019054906101000a900460ff166040518363ffffffff1660e01b8152600401610249929190610824565b60206040518083038186803b15801561026157600080fd5b505afa158015610275573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102999190610879565b816000815181106102ad576102ac6107e6565b5b602002602001015160400181815250506103d5565b6001816000815181106102d8576102d76107e6565b5b60200260200101516000019060018111156102f6576102f5610587565b5b9081600181111561030a57610309610587565b5b815250508573ffffffffffffffffffffffffffffffffffffffff1663bb485395866000800160019054906101000a900460ff166040518363ffffffff1660e01b815260040161035a929190610824565b60206040518083038186803b15801561037257600080fd5b505afa158015610386573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103aa91906108d2565b816000815181106103be576103bd6107e6565b5b602002602001015160600190151590811515815250505b80925050509392505050565b604051806080016040528060006001811115610400576103ff610587565b5b8152602001600060ff168152602001600081526020016000151581525090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061045082610425565b9050919050565b600061046282610445565b9050919050565b61047281610457565b811461047d57600080fd5b50565b60008135905061048f81610469565b92915050565b600061ffff82169050919050565b6104ac81610495565b81146104b757600080fd5b50565b6000813590506104c9816104a3565b92915050565b600060ff82169050919050565b6104e5816104cf565b81146104f057600080fd5b50565b600081359050610502816104dc565b92915050565b60008060006060848603121561052157610520610420565b5b600061052f86828701610480565b9350506020610540868287016104ba565b9250506040610551868287016104f3565b9150509250925092565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600281106105c7576105c6610587565b5b50565b60008190506105d8826105b6565b919050565b60006105e8826105ca565b9050919050565b6105f8816105dd565b82525050565b610607816104cf565b82525050565b6000819050919050565b6106208161060d565b82525050565b60008115159050919050565b61063b81610626565b82525050565b60808201600082015161065760008501826105ef565b50602082015161066a60208501826105fe565b50604082015161067d6040850182610617565b5060608201516106906060850182610632565b50505050565b60006106a28383610641565b60808301905092915050565b6000602082019050919050565b60006106c68261055b565b6106d08185610566565b93506106db83610577565b8060005b8381101561070c5781516106f38882610696565b97506106fe836106ae565b9250506001810190506106df565b5085935050505092915050565b6000602082019050818103600083015261073381846106bb565b905092915050565b61074481610495565b82525050565b600060208201905061075f600083018461073b565b92915050565b6003811061077257600080fd5b50565b60008151905061078481610765565b92915050565b6000602082840312156107a05761079f610420565b5b60006107ae84828501610775565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b61081e816104cf565b82525050565b6000604082019050610839600083018561073b565b6108466020830184610815565b9392505050565b6108568161060d565b811461086157600080fd5b50565b6000815190506108738161084d565b92915050565b60006020828403121561088f5761088e610420565b5b600061089d84828501610864565b91505092915050565b6108af81610626565b81146108ba57600080fd5b50565b6000815190506108cc816108a6565b92915050565b6000602082840312156108e8576108e7610420565b5b60006108f6848285016108bd565b9150509291505056fea264697066735822122043afeb1a85766de61ec987d88306824651d55e7b3852d34ccdcffccec51675f664736f6c63430008090033";

type VariableSetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VariableSetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VariableSet__factory extends ContractFactory {
  constructor(...args: VariableSetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    socketIndeces: VariableSetIndecesStruct,
    variableId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<VariableSet> {
    return super.deploy(
      socketIndeces,
      variableId,
      overrides || {}
    ) as Promise<VariableSet>;
  }
  override getDeployTransaction(
    socketIndeces: VariableSetIndecesStruct,
    variableId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      socketIndeces,
      variableId,
      overrides || {}
    );
  }
  override attach(address: string): VariableSet {
    return super.attach(address) as VariableSet;
  }
  override connect(signer: Signer): VariableSet__factory {
    return super.connect(signer) as VariableSet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VariableSetInterface {
    return new utils.Interface(_abi) as VariableSetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VariableSet {
    return new Contract(address, _abi, signerOrProvider) as VariableSet;
  }
}
