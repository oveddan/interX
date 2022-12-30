// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

enum ValueType {
  Int,
  Bool,
  NotAVariable
}

enum UpdateType {
  IntVariableUpdated,
  BoolVariableUpdated
}

struct GraphUpdate {
  UpdateType updateType;
  uint8 variableId;
  int256 intValue;
  bool boolValue;
}

interface IBehaviorGraph {
  function getNodeStateVal(uint16 _nodeId, string memory _stateVar) external view returns (int256);

  function setNodeIntStateVal(uint16 _nodeId, string memory _stateVar, int256 val) external;

  function writeToOutput(uint16 _nodeId, uint8 _socketId, int256 val) external;

  function triggerEdge(uint16 _nodeId, uint8 _socketIndex) external returns (GraphUpdate[] memory);

  function getBoolInputVal(uint16 _nodeId, uint8 _socketName) external view returns (bool);

  function getInputValueType(uint16 _nodeId) external view returns (ValueType);

  function getStringInputVal(uint16 _nodeId, uint8 _socketName) external view returns (string memory);

  function getIntInputVal(uint16 _nodeId, uint8 _socketName) external view returns (int256);

  // function setVariable(uint8 _variableId, int256 val) external;

  // function setVariable(uint8 _variableId, bool val) external;
}

interface ITriggerNode {
  function trigger(
    IBehaviorGraph _behaviorGraph,
    uint16 _nodeId,
    uint8 _triggeringSocketIndex
  ) external returns (GraphUpdate[] memory);
}

interface IFunctionNode {
  function execute(IBehaviorGraph behaviorGraph, uint16 _nodeId) external;
}
