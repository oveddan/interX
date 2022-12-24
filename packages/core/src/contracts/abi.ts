export const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "nodeId",
        "type": "uint16"
      }
    ],
    "name": "CannotTriggerExternally",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "nodeId",
        "type": "uint16"
      }
    ],
    "name": "InvalidActionId",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "nodeId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "MissingTokens",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "executor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "tokenId",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "variableName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "value",
        "type": "bool"
      }
    ],
    "name": "BoolVariableUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "executor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "tokenId",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "variableName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "value",
        "type": "int256"
      }
    ],
    "name": "IntVariableUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "toNode",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "uri",
        "type": "string"
      },
      {
        "components": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "enum NodeType",
                "name": "nodeType",
                "type": "uint8"
              },
              {
                "internalType": "bool",
                "name": "defined",
                "type": "bool"
              },
              {
                "internalType": "enum ValueType",
                "name": "inputValueType",
                "type": "uint8"
              }
            ],
            "internalType": "struct NodeDefinition",
            "name": "definition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bool",
                    "name": "value",
                    "type": "bool"
                  },
                  {
                    "internalType": "uint8",
                    "name": "socket",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct BooleanValueAndLabel[]",
                "name": "booleans",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "int256",
                    "name": "value",
                    "type": "int256"
                  },
                  {
                    "internalType": "uint8",
                    "name": "socket",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IntValueAndLabel[]",
                "name": "integers",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "value",
                    "type": "string"
                  },
                  {
                    "internalType": "uint8",
                    "name": "socket",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct StringValueAndLabel[]",
                "name": "strings",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct InitialValues",
            "name": "initialValues",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct NodeDefinitionAndValues[]",
        "name": "nodes",
        "type": "tuple[]"
      }
    ],
    "name": "SafeMint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "tokenId",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_nodeId",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "_socketName",
        "type": "uint8"
      }
    ],
    "name": "getBoolInputVal",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "tokenId",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_nodeId",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "_socketName",
        "type": "uint8"
      }
    ],
    "name": "getIntInputVal",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "tokenId",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_nodeId",
        "type": "uint16"
      },
      {
        "internalType": "string",
        "name": "_stateVar",
        "type": "string"
      }
    ],
    "name": "getNodeStateVal",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSocketIndecesByNodeType",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "outputFlowSocket",
                "type": "uint8"
              }
            ],
            "internalType": "struct ExternalTriggerIndeces",
            "name": "externalTrigger",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "inputFlow",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "outputCount",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "outputFlow",
                "type": "uint8"
              }
            ],
            "internalType": "struct CounterSocketIndeces",
            "name": "counter",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "input1",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "input2",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "result",
                "type": "uint8"
              }
            ],
            "internalType": "struct Int2Out1SocketIndeces",
            "name": "add",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "inputFlow",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "inputVal",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "variableName",
                "type": "uint8"
              }
            ],
            "internalType": "struct VariableSetIndeces",
            "name": "variableSet",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "inputFlow",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "outputGateTrue",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "outputGateFalse",
                "type": "uint8"
              }
            ],
            "internalType": "struct GateSocketIndeces",
            "name": "gate",
            "type": "tuple"
          }
        ],
        "internalType": "struct SocketIndecesByNodeType",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "tokenId",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_nodeId",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "_socketName",
        "type": "uint8"
      }
    ],
    "name": "getStringInputVal",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "sceneUri",
        "type": "string"
      },
      {
        "components": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "enum NodeType",
                "name": "nodeType",
                "type": "uint8"
              },
              {
                "internalType": "bool",
                "name": "defined",
                "type": "bool"
              },
              {
                "internalType": "enum ValueType",
                "name": "inputValueType",
                "type": "uint8"
              }
            ],
            "internalType": "struct NodeDefinition",
            "name": "definition",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bool",
                    "name": "value",
                    "type": "bool"
                  },
                  {
                    "internalType": "uint8",
                    "name": "socket",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct BooleanValueAndLabel[]",
                "name": "booleans",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "int256",
                    "name": "value",
                    "type": "int256"
                  },
                  {
                    "internalType": "uint8",
                    "name": "socket",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IntValueAndLabel[]",
                "name": "integers",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "value",
                    "type": "string"
                  },
                  {
                    "internalType": "uint8",
                    "name": "socket",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct StringValueAndLabel[]",
                "name": "strings",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct InitialValues",
            "name": "initialValues",
            "type": "tuple"
          }
        ],
        "internalType": "struct NodeDefinitionAndValues[]",
        "name": "_nodes",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "fromNode",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "toNode",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "fromSocket",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "toSocket",
            "type": "uint8"
          }
        ],
        "internalType": "struct EdgeDefinition[]",
        "name": "_edges",
        "type": "tuple[]"
      }
    ],
    "name": "safeMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_tokenId",
        "type": "uint16"
      },
      {
        "internalType": "string",
        "name": "_nodeId",
        "type": "string"
      }
    ],
    "name": "trigger",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const