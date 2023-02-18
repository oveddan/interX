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
  mapping(uint16 => mapping(uint8 => IntValue)) private _nodeInputIntVals;
  mapping(uint16 => mapping(uint8 => StringValue)) private _nodeInputStringVals;
  mapping(uint16 => mapping(uint8 => BoolValue)) private _nodeBoolInputVals;

  mapping(uint16 => mapping(string => IntValue)) private _nodeIntStateVals;

  constructor() {}

  function _getIntInputVal(uint16 _nodeId, uint8 _socketName) internal view returns (int256) {
    // uint16 val = uint16(_nodeInputIntVals[_nodeId][_socketName]);
    // console.log("get int input val %s %s: %i",_nodeId,  _socketName, val);

    IntValue memory val = _nodeInputIntVals[_nodeId][_socketName];

    if (val.set) return val.value;
    return 0;
  }

  function _setInputVal(uint16 _nodeId, uint8 _socketName, int256 val) internal {
    // console.log("set int input val %s %s: %i", _nodeId, _socketName, uint16(val));
    _nodeInputIntVals[_nodeId][_socketName] = IntValue(val, true);
  }

  function _getBoolInputVal(uint16 _nodeId, uint8 _socketName) internal view returns (bool) {
    BoolValue memory val = _nodeBoolInputVals[_nodeId][_socketName];

    if (val.set) return val.value;
    return false;
  }

  function _setInputVal(uint16 _nodeId, uint8 _socketName, bool val) internal {
    _nodeBoolInputVals[_nodeId][_socketName] = BoolValue(val, true);
  }

  function _getStringInputVal(uint16 _nodeId, uint8 _socketName) internal view returns (string memory) {
    StringValue memory val = _nodeInputStringVals[_nodeId][_socketName];

    if (val.set) return val.value;

    return '';
  }

  function _setInputVal(uint16 _nodeId, uint8 _socketName, string memory val) internal {
    _nodeInputStringVals[_nodeId][_socketName] = StringValue(val, true);
  }

  function _setNodeIntStateVal(uint16 _nodeId, string memory _stateVar, int256 val) internal {
    _nodeIntStateVals[_nodeId][_stateVar] = IntValue(val, true);
  }

  function _getNodeStateVal(uint16 _nodeId, string memory _stateVar) internal view returns (int256) {
    IntValue memory val = _nodeIntStateVals[_nodeId][_stateVar];

    if (val.set) return val.value;
    return 0;
  }

  function _setInitialValues(uint16 _nodeId, InitialValues memory _initialValues) internal {
    // set initial boolean values
    for (uint16 j = 0; j < _initialValues.booleans.length; j++) {
      BooleanValueAndLabel memory boolVal = _initialValues.booleans[j];
      _setInputVal(_nodeId, boolVal.socket, boolVal.value);
    }

    // set initial int values
    for (uint16 j = 0; j < _initialValues.integers.length; j++) {
      IntValueAndLabel memory intVal = _initialValues.integers[j];
      _setInputVal(_nodeId, intVal.socket, intVal.value);
    }

    // set initial string values
    for (uint16 j = 0; j < _initialValues.strings.length; j++) {
      StringValueAndLabel memory stringVal = _initialValues.strings[j];
      _setInputVal(_nodeId, stringVal.socket, stringVal.value);
    }
  }
}

struct VariableIdAndSet {
  bool set;
  uint8 id;
}

contract HasVariables {
  event IntVariableUpdated(address executor, uint8 _variableId, int256 value);
  event BoolVariableUpdated(address executor, uint8 _variableId, bool value);

  constructor() {}

  function _setVariable(uint8 _variableId, int256 val) internal {
    // uint8 _variableId = _getOrSetVariable(tokenId, _variableName);
    // _intVarVals[_variableId] = val;
    emit IntVariableUpdated(msg.sender, _variableId, val);
  }

  function _setVariable(uint8 _variableId, bool val) internal {
    // uint8 _variableId = _getOrSetVariable(tokenId, _variableName);
    // _boolVarVals[_variableId] = val;
    emit BoolVariableUpdated(msg.sender, _variableId, val);
  }
}
