export const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint128",
        "name": "nodeId",
        "type": "uint128"
      }
    ],
    "name": "CannotTriggerExternally",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint128",
        "name": "nodeId",
        "type": "uint128"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
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
                "internalType": "uint128",
                "name": "id",
                "type": "uint128"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "_nodeId",
        "type": "uint128"
      },
      {
        "internalType": "uint8",
        "name": "_triggeringSocketName",
        "type": "uint8"
      }
    ],
    "name": "_triggerNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "_nodeId",
        "type": "uint128"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_variableName",
        "type": "string"
      }
    ],
    "name": "getBoolVariable",
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "_nodeId",
        "type": "uint128"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_variableName",
        "type": "string"
      }
    ],
    "name": "getIntVariable",
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "_nodeId",
        "type": "uint128"
      }
    ],
    "name": "getNodeDefinition",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint128",
            "name": "id",
            "type": "uint128"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "_nodeId",
        "type": "uint128"
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
    "name": "getSocketNames",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "inOutSocketA",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "inOutSocketB",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "inOutSocketResult",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "flowSocketName",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "gateTrueSocketName",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "gateFalseSocketName",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "variableNameSocket",
            "type": "uint8"
          }
        ],
        "internalType": "struct SocketNames",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "_nodeId",
        "type": "uint128"
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
                "internalType": "uint128",
                "name": "id",
                "type": "uint128"
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
            "internalType": "uint128",
            "name": "fromNode",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "toNode",
            "type": "uint128"
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
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "_nodeId",
        "type": "uint128"
      }
    ],
    "name": "trigger",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const