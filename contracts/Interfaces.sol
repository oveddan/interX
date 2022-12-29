// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

enum ValueType {
  Int,
  Bool,
  NotAVariable
}

interface IBehaviorGraph {
  function getNodeStateVal(uint16 _nodeId, string memory _stateVar) external view returns (int256);

  function setNodeIntStateVal(uint16 _nodeId, string memory _stateVar, int256 val) external;

  function writeToOutput(uint16 _nodeId, uint8 _socketId, int256 val) external;

  function triggerEdge(uint16 _nodeId, uint8 _socketIndex) external;

  function getBoolInputVal(uint16 _nodeId, uint8 _socketName) external view returns (bool);

  function getInputValueType(uint16 _nodeId) external view returns (ValueType);

  function getStringInputVal(uint16 _nodeId, uint8 _socketName) external view returns (string memory);

  function getIntInputVal(uint16 _nodeId, uint8 _socketName) external view returns (int256);

  function setVariable(string memory socketName, int256 val) external;

  function setVariable(string memory socketName, bool val) external;
}

interface ITriggerNode {
  function trigger(IBehaviorGraph _behaviorGraph, uint16 _nodeId, uint8 _triggeringSocketIndex) external;
}

interface IFunctionNode {
  function execute(IBehaviorGraph behaviorGraph, uint16 _nodeId) external;
}
