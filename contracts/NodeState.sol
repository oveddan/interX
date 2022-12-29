// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import './IndexedNodes.sol';

struct BooleanValueAndLabel {
  bool value;
  uint8 socket;
}

struct IntValueAndLabel {
  int256 value;
  uint8 socket;
}

struct StringValueAndLabel {
  string value;
  uint8 socket;
}

struct InitialValues {
  BooleanValueAndLabel[] booleans;
  IntValueAndLabel[] integers;
  StringValueAndLabel[] strings;
}

struct IntValue {
  int256 value;
  bool set;
}

struct BoolValue {
  bool value;
  bool set;
}

struct StringValue {
  string value;
  bool set;
}

contract NodeState {
  mapping(uint16 => mapping(uint16 => mapping(uint8 => IntValue))) private _nodeInputIntVals;
  mapping(uint16 => mapping(uint16 => mapping(uint8 => StringValue))) private _nodeInputStringVals;
  mapping(uint16 => mapping(uint16 => mapping(uint8 => BoolValue))) private _nodeBoolInputVals;

  mapping(uint16 => mapping(uint16 => mapping(string => IntValue))) private _nodeIntStateVals;

  constructor() {}

  function _getIntInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName) internal view returns (int256) {
    // uint16 val = uint16(_nodeInputIntVals[tokenId][_nodeId][_socketName]);
    // console.log("get int input val %s %s: %i",_nodeId,  _socketName, val);

    IntValue memory val = _nodeInputIntVals[tokenId][_nodeId][_socketName];

    if (val.set) return val.value;
    return 0;
  }

  function _setIntInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName, int256 val) internal {
    // console.log("set int input val %s %s: %i", _nodeId, _socketName, uint16(val));
    _nodeInputIntVals[tokenId][_nodeId][_socketName] = IntValue(val, true);
  }

  function _getBoolInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName) internal view returns (bool) {
    BoolValue memory val = _nodeBoolInputVals[tokenId][_nodeId][_socketName];

    if (val.set) return val.value;
    return false;
  }

  function _setBoolInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName, bool val) internal {
    _nodeBoolInputVals[tokenId][_nodeId][_socketName] = BoolValue(val, true);
  }

  function _getStringInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName) internal view returns (string memory) {
    StringValue memory val = _nodeInputStringVals[tokenId][_nodeId][_socketName];

    if (val.set) return val.value;

    return '';
  }

  function _setStringInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName, string memory val) internal {
    _nodeInputStringVals[tokenId][_nodeId][_socketName] = StringValue(val, true);
  }

  function _setNodeIntStateVal(uint16 tokenId, uint16 _nodeId, string memory _stateVar, int256 val) internal {
    _nodeIntStateVals[tokenId][_nodeId][_stateVar] = IntValue(val, true);
  }

  function _getNodeStateVal(uint16 tokenId, uint16 _nodeId, string memory _stateVar) internal view returns (int256) {
    IntValue memory val = _nodeIntStateVals[tokenId][_nodeId][_stateVar];

    if (val.set) return val.value;
    return 0;
  }

  function _setInitialValues(uint16 tokenId, uint16 _nodeId, InitialValues memory _initialValues) internal {
    // set initial boolean values
    for (uint16 j = 0; j < _initialValues.booleans.length; j++) {
      BooleanValueAndLabel memory boolVal = _initialValues.booleans[j];
      _setBoolInputVal(tokenId, _nodeId, boolVal.socket, boolVal.value);
    }

    // set initial int values
    for (uint16 j = 0; j < _initialValues.integers.length; j++) {
      IntValueAndLabel memory intVal = _initialValues.integers[j];
      _setIntInputVal(tokenId, _nodeId, intVal.socket, intVal.value);
    }

    // set initial string values
    for (uint16 j = 0; j < _initialValues.strings.length; j++) {
      StringValueAndLabel memory stringVal = _initialValues.strings[j];
      _setStringInputVal(tokenId, _nodeId, stringVal.socket, stringVal.value);
    }
  }
}

struct VariableIdAndSet {
  bool set;
  uint8 id;
}

contract HasVariables {
  event IntVariableUpdated(address executor, uint16 tokenId, string variableName, int256 value);
  event BoolVariableUpdated(address executor, uint16 tokenId, string variableName, bool value);

  constructor() {}

  function _setVariable(uint16 tokenId, string memory _variableName, int256 val) internal {
    // uint8 _variableId = _getOrSetVariable(tokenId, _variableName);
    // _intVarVals[tokenId][_variableId] = val;
    emit IntVariableUpdated(msg.sender, tokenId, _variableName, val);
  }

  function _setVariable(uint16 tokenId, string memory _variableName, bool val) internal {
    // uint8 _variableId = _getOrSetVariable(tokenId, _variableName);
    // _boolVarVals[tokenId][_variableId] = val;
    emit BoolVariableUpdated(msg.sender, tokenId, _variableName, val);
  }
}
