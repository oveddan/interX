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
}

struct Int2Out1SocketIndeces {
  uint8 input1;
  uint8 input2;
  uint8 result;
}

contract Counter is Node, ITriggerNode {
  uint256 public count;

  CounterSocketIndeces private _socketIndeces;

  constructor(CounterSocketIndeces memory socketIndeces) {
    _socketIndeces = socketIndeces;
  }

  function trigger(
    IBehaviorGraph _behaviorGraph,
    uint16 _nodeId,
    uint8 _triggeringSocketIndex
  ) external returns (GraphUpdate[] memory) {
    // update state to increment counter
    // this is internal, so we dont need to store it in constant
    int256 newStateVal = _behaviorGraph.getNodeStateVal(_nodeId, 'count') + 1;
    _behaviorGraph.setNodeIntStateVal(_nodeId, 'count', newStateVal);

    // write the count to the output
    _behaviorGraph.writeToOutput(_nodeId, _socketIndeces.outputCount, newStateVal);
    // trigger the flow edge
    return _behaviorGraph.triggerEdge(_nodeId, _socketIndeces.outputFlow);
  }
}

contract Gate is Node, ITriggerNode {
  GateSocketIndeces private _socketIndeces;

  constructor(GateSocketIndeces memory socketIndeces) {
    _socketIndeces = socketIndeces;
  }

  function trigger(
    IBehaviorGraph _behaviorGraph,
    uint16 _nodeId,
    uint8 _triggeringSocketIndex
  ) external returns (GraphUpdate[] memory) {
    // get the socket to trigger
    uint8 toTrigger = _behaviorGraph.getBoolInputVal(_nodeId, _triggeringSocketIndex)
      ? _socketIndeces.outputGateTrue
      : _socketIndeces.outputGateFalse;
    // trigger the flow edge along that socket
    return _behaviorGraph.triggerEdge(_nodeId, toTrigger);
  }
}

contract VariableSet is Node, ITriggerNode {
  VariableSetIndeces private _socketIndeces;

  uint8 private _variableId;

  constructor(VariableSetIndeces memory socketIndeces, uint8 variableId) {
    _socketIndeces = socketIndeces;
    _variableId = variableId;
  }

  function trigger(
    IBehaviorGraph _behaviorGraph,
    uint16 _nodeId,
    uint8 _triggeringSocketIndex
  ) external returns (GraphUpdate[] memory) {
    // determine what type of value is stored
    ValueType _inputValueType = _behaviorGraph.getInputValueType(_nodeId);

    GraphUpdate[] memory updates = new GraphUpdate[](1);

    updates[0].variableId = _variableId;

    // if it is an int variable
    if (_inputValueType == ValueType.Int) {
      updates[0].updateType = UpdateType.IntVariableUpdated;
      updates[0].intValue = _behaviorGraph.getIntInputVal(_nodeId, _socketIndeces.inputVal);
    } else {
      updates[0].updateType = UpdateType.BoolVariableUpdated;
      updates[0].boolValue = _behaviorGraph.getBoolInputVal(_nodeId, _socketIndeces.inputVal);
    }

    return updates;
  }
}

struct ExternalInvokeIndeces {
  uint8 outputFlowSocket;
}

contract ExternalInvoke is Node, ITriggerNode {
  ExternalInvokeIndeces private _socketIndeces;

  constructor(ExternalInvokeIndeces memory socketIndeces) {
    _socketIndeces = socketIndeces;
  }

  function trigger(
    IBehaviorGraph _behaviorGraph,
    uint16 _nodeId,
    uint8 _triggeringSocketIndex
  ) external returns (GraphUpdate[] memory) {
    return _behaviorGraph.triggerEdge(_nodeId, _socketIndeces.outputFlowSocket);
  }
}

contract Add is Node, IFunctionNode {
  Int2Out1SocketIndeces private _socketIndeces;

  constructor(Int2Out1SocketIndeces memory socketIndeces) {
    _socketIndeces = socketIndeces;
  }

  function execute(IBehaviorGraph _behaviorGraph, uint16 _nodeId) external {
    int256 val = _behaviorGraph.getIntInputVal(_nodeId, _socketIndeces.input1) +
      _behaviorGraph.getIntInputVal(_nodeId, _socketIndeces.input2);

    _behaviorGraph.writeToOutput(_nodeId, _socketIndeces.result, val);
  }
}
