// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './Interfaces.sol';

contract Node {
  // IBehaviorGraph internal _behaviorGraph;
  // constructor(IBehaviorGraph behaviorGraph) {
  //   _behaviorGraph = behaviorGraph;
  // }
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

struct Int2Out1SocketIndeces {
  uint8 input1;
  uint8 input2;
  uint8 result;
}

contract Counter is Node, ITriggerNode {
  uint256 public count;

  // constructor(IBehaviorGraph behaviorGraph) Node(behaviorGraph) {}

  function getSocketIndeces() public pure returns (CounterSocketIndeces memory) {
    return CounterSocketIndeces({ inputFlow: 0, outputCount: 1, outputFlow: 2 });
  }

  function trigger(IBehaviorGraph _behaviorGraph, uint16 _nodeId, uint8 _triggeringSocketIndex) external {
    // update state to increment counter
    // this is internal, so we dont need to store it in constant
    int256 newStateVal = _behaviorGraph.getNodeStateVal(_nodeId, 'count') + 1;
    _behaviorGraph.setNodeIntStateVal(_nodeId, 'count', newStateVal);

    CounterSocketIndeces memory socketIndeces = getSocketIndeces();
    // write the count to the output
    _behaviorGraph.writeToOutput(_nodeId, socketIndeces.outputCount, newStateVal);
    // trigger the flow edge
    _behaviorGraph.triggerEdge(_nodeId, socketIndeces.outputFlow);
  }
}

contract Gate is Node, ITriggerNode {
  function getSocketIndeces() public pure returns (GateSocketIndeces memory) {
    return GateSocketIndeces({ inputFlow: 0, outputGateTrue: 1, outputGateFalse: 2 });
  }

  function trigger(IBehaviorGraph _behaviorGraph, uint16 _nodeId, uint8 _triggeringSocketIndex) external {
    GateSocketIndeces memory socketIndeces = getSocketIndeces();
    // get the socket to trigger
    uint8 toTrigger = _behaviorGraph.getBoolInputVal(_nodeId, _triggeringSocketIndex)
      ? socketIndeces.outputGateTrue
      : socketIndeces.outputGateFalse;
    // trigger the flow edge along that socket
    _behaviorGraph.triggerEdge(_nodeId, toTrigger);
  }
}

contract VariableSet is Node, ITriggerNode {
  function getSocketIndeces() public pure returns (VariableSetIndeces memory) {
    return VariableSetIndeces({ inputFlow: 0, inputVal: 1, variableName: 2 });
  }

  function trigger(IBehaviorGraph _behaviorGraph, uint16 _nodeId, uint8 _triggeringSocketIndex) external {
    VariableSetIndeces memory socketIndeces = getSocketIndeces();
    string memory variableSocketName = _behaviorGraph.getStringInputVal(_nodeId, socketIndeces.variableName);

    // determine what type of value is stored
    ValueType _inputValueType = _behaviorGraph.getInputValueType(_nodeId);

    // if it is an int variable
    if (_inputValueType == ValueType.Int) {
      _behaviorGraph.setVariable(variableSocketName, _behaviorGraph.getIntInputVal(_nodeId, socketIndeces.inputVal));
    } else {
      _behaviorGraph.setVariable(variableSocketName, _behaviorGraph.getBoolInputVal(_nodeId, socketIndeces.inputVal));
    }
  }
}

contract Add is Node, IFunctionNode {
  function getSocketIneces() public pure returns (Int2Out1SocketIndeces memory) {
    return Int2Out1SocketIndeces({ input1: 0, input2: 1, result: 2 });
  }

  function execute(IBehaviorGraph _behaviorGraph, uint16 _nodeId) external {
    Int2Out1SocketIndeces memory socketIndeces = getSocketIneces();

    int256 val = _behaviorGraph.getIntInputVal(_nodeId, socketIndeces.input1) +
      _behaviorGraph.getIntInputVal(_nodeId, socketIndeces.input2);

    _behaviorGraph.writeToOutput(_nodeId, socketIndeces.result, val);
  }
}
