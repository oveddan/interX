// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

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
  BooleanValueAndLabel [] booleans;
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
    mapping(uint256 => mapping(string => mapping(uint8 => IntValue))) private _nodeInputIntVals;
    mapping(uint256 => mapping(string => mapping(uint8 => StringValue))) private _nodeInputStringVals;
    mapping(uint256 => mapping(string => mapping(uint8 => BoolValue))) private _nodeBoolInputVals;

    mapping(uint256 => mapping(string => mapping(string => IntValue))) private _nodeIntStateVals;

    constructor() {}

    function getIntInputVal(uint256 tokenId, string memory _nodeId, uint8 _socketName) public view returns(int256) {
      // uint256 val = uint256(_nodeInputIntVals[tokenId][_nodeId][_socketName]);
      // console.log("get int input val %s %s: %i",_nodeId,  _socketName, val);

      IntValue memory val = _nodeInputIntVals[tokenId][_nodeId][_socketName];
    
      if(val.set) return val.value;
      return 0;
    }

    function _setIntInputVal(uint256 tokenId, string memory _nodeId, uint8 _socketName, int256 val) internal {
      // console.log("set int input val %s %s: %i", _nodeId, _socketName, uint256(val));
      _nodeInputIntVals[tokenId][_nodeId][_socketName] = IntValue(val, true);
    }

    function getBoolInputVal(uint256 tokenId, string memory _nodeId, uint8 _socketName) public view returns(bool) {
      BoolValue memory val = _nodeBoolInputVals[tokenId][_nodeId][_socketName];
    
      if (val.set) return val.value;
      return false;
    }

    function _setBoolInputVal(uint256 tokenId, string memory _nodeId, uint8 _socketName, bool val) internal {
      _nodeBoolInputVals[tokenId][_nodeId][_socketName] = BoolValue(val, true);
    }

    function getStringInputVal(uint256 tokenId, string memory _nodeId, uint8 _socketName) public view returns(string memory) {
      StringValue memory val = _nodeInputStringVals[tokenId][_nodeId][_socketName];
    
      if (val.set) return val.value;
    
      return '';
    }

    function _setStringInputVal(uint256 tokenId, string memory _nodeId, uint8 _socketName, string memory val) internal {
      _nodeInputStringVals[tokenId][_nodeId][_socketName] = StringValue(val, true);
    }

    function _setNodeIntStateVal(uint256 tokenId, string memory _nodeId, string memory _stateVar, int256 val) internal {
      _nodeIntStateVals[tokenId][_nodeId][_stateVar] = IntValue(val, true);
    }

    function getNodeStateVal(uint256 tokenId, string memory _nodeId, string memory _stateVar) public view returns(int256) {
      IntValue memory val = _nodeIntStateVals[tokenId][_nodeId][_stateVar];
    
      if(val.set) return val.value;
      return 0;
    }


    function _setInitialValues(uint256 tokenId, string memory _nodeId, InitialValues memory _initialValues) internal {
      // set initial boolean values
      for(uint256 j = 0; j < _initialValues.booleans.length; j++) {
        BooleanValueAndLabel memory boolVal = _initialValues.booleans[j];
        _setBoolInputVal(tokenId, _nodeId, boolVal.socket, boolVal.value);
      }
      
      // set initial int values
      for(uint256 j= 0; j < _initialValues.integers.length; j++) {
        IntValueAndLabel memory intVal = _initialValues.integers[j];
        _setIntInputVal(tokenId, _nodeId, intVal.socket, intVal.value);
      }
      
      // set initial string values
      for(uint256 j = 0; j < _initialValues.strings.length; j++) {
        StringValueAndLabel memory stringVal = _initialValues.strings[j];
        _setStringInputVal(tokenId, _nodeId, stringVal.socket, stringVal.value);
      }
    }
}