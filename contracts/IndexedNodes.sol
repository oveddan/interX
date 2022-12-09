// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

enum NodeType {
  ExternalTrigger,
  Counter,
  Add,
  Gate,
  VariableSet
}

struct ExternalTriggerIndeces {
  uint8 outputFlowSocket;
}

struct Int2Out1SocketIndeces {
  uint8 input1;
  uint8 input2;
  uint8 result;
}

struct CounterSocketIndeces {
  uint8 inputFlow;
  uint8 outputCount;
  uint8 outputFlow;
}

struct GateSocketIndeces {
  uint8 inputFlow;
  uint8 outputGateTrue;
  uint8 outputGateFalse;
}

struct VariableSetIndeces {
  uint8 inputFlow;
  uint8 inputVal;
  uint8 variableName;
}

struct SocketIndecesByNodeType {
  ExternalTriggerIndeces externalTrigger;
  CounterSocketIndeces counter;
  Int2Out1SocketIndeces add;
  VariableSetIndeces variableSet;
  GateSocketIndeces gate;
}

contract SocketsIndexedByName {
  // // input node socket index to socket name, mapped by token id, node index, and socket name
  // mapping(NodeType => mapping(string => uint8)) private _inputNodeSocketIndeces;
  // // output node socket index to socket name, mapped by node type
  // mapping(NodeType => mapping(string => uint8)) private _outputNodeSocketIndeces;

  SocketIndecesByNodeType private _socketIndecesByNodeType;

  constructor() {
    // initialize socket indeces by node type with incremeting
    // and unique values
    _socketIndecesByNodeType = SocketIndecesByNodeType({
      externalTrigger: ExternalTriggerIndeces({ outputFlowSocket: 0 }),
      counter: CounterSocketIndeces({ inputFlow: 0, outputCount: 1, outputFlow: 2 }),
      add: Int2Out1SocketIndeces({ input1: 0, input2: 1, result: 2 }),
      variableSet: VariableSetIndeces({ inputFlow: 0, inputVal: 1, variableName: 2 }),
      gate: GateSocketIndeces({ inputFlow: 0, outputGateTrue: 1, outputGateFalse: 2 })
    });
  }

  function getSocketIndecesByNodeType() public view returns (SocketIndecesByNodeType memory) {
    return _socketIndecesByNodeType;
  }

  // function _setInputOutputNodeSocketIndeces(NodeType nodeType, string[] calldata inputSockets, string[] calldata outputSockets) internal {
  //   // set the input and output socket indeces for each input and output socket
  //   // of the node.  This is used to look up the socket index when by name.
  //   for(uint256 j = 0; j < inputSockets.length; j++) {
  //     _inputNodeSocketIndeces[nodeType][inputSockets[j]] = uint8(j);
  //   }
  //   for(uint256 j = 0; j < outputSockets.length; j++) {
  //     _outputNodeSocketIndeces[nodeType][outputSockets[j]] = uint8(j);
  //   }
  // }

  // function getInputNodeSocketIndex(NodeType nodeType, string memory socketName) public view returns(uint8) {
  //   return _inputNodeSocketIndeces[nodeType][socketName];
  // }

  // function getOutputNodeSocketIndex(NodeType nodeType, string memory socketName) public view returns(uint8) {
  //   return _outputNodeSocketIndeces[nodeType][socketName];
  // }
}
