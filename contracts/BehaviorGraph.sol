// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

import './Interfaces.sol';
import './Nodes.sol';
import './NodeState.sol';

enum NodeType {
  ExternalTrigger,
  Counter,
  Add,
  Gate,
  VariableSet
}

struct NodeDefinition {
  string id;
  NodeType nodeType;
  bool defined;
  // will only be set if this is a variable
  ValueType inputValueType;
}

struct NodeDefinitionAndValues {
  NodeDefinition definition;
  InitialValues initialValues;
}

struct EdgeDefinition {
  string fromNode;
  string toNode;
  uint8 fromSocket;
  uint8 toSocket;
}

struct EdgeToNode {
  uint16 toNode;
  uint8 toSocket;
  bool set;
}

contract BehaviorGraph is NodeState, HasVariables, IBehaviorGraph {
  mapping(uint16 => mapping(string => uint16)) private _nodeIndeces;
  // edges between nodes, indexed by token id, node index, and socket index
  mapping(uint16 => mapping(uint16 => mapping(uint8 => EdgeToNode))) private _tokenEdges;

  // node node definition, mapped by node index and token id
  mapping(uint16 => mapping(uint16 => NodeType)) private _nodeTypes;
  mapping(uint16 => mapping(uint16 => ValueType)) private _inputValueTypes;

  error InvalidActionId(uint16 nodeId);
  error CannotTriggerExternally(uint16 nodeId);

  constructor() {}

  function _getNodeIndex(uint16 tokenId, string memory nodeId) private view returns (uint16) {
    return _nodeIndeces[tokenId][nodeId];
  }

  function _getNodeType(uint16 tokenId, uint16 nodeIndex) private view returns (NodeType) {
    return _nodeTypes[tokenId][nodeIndex];
  }

  function createNodes(
    uint16 tokenId,
    NodeDefinitionAndValues[] calldata _nodes,
    EdgeDefinition[] calldata _edges
  ) external {
    // for each node definition and values, create a node and set the initial values
    for (uint16 nodeIndex = 0; nodeIndex < _nodes.length; nodeIndex++) {
      NodeDefinitionAndValues calldata nodeAndValues = _nodes[nodeIndex];
      NodeDefinition calldata node = nodeAndValues.definition;
      NodeType nodeType = node.nodeType;

      _nodeIndeces[tokenId][node.id] = nodeIndex;
      _nodeTypes[tokenId][nodeIndex] = nodeType;
      _inputValueTypes[tokenId][nodeIndex] = node.inputValueType;

      _setInitialValues(tokenId, nodeIndex, nodeAndValues.initialValues);

      // store the indeces for the sockets, so that they can be mapped by int later.
      // _setInputOutputNodeSocketIndeces(nodeType, node.inputSockets, node.outputSockets);
    }
    for (uint16 i = 0; i < _edges.length; i++) {
      EdgeDefinition calldata edge = _edges[i];

      uint16 fromNode = _getNodeIndex(tokenId, edge.fromNode);
      uint16 toNode = _getNodeIndex(tokenId, edge.toNode);
      uint8 fromSocket = edge.fromSocket;

      // get the to node type
      uint8 toSocket = edge.toSocket;

      _tokenEdges[tokenId][fromNode][fromSocket] = EdgeToNode(toNode, toSocket, true);
    }
  }

  function getNodeStateVal(uint16 tokenId, uint16 _nodeId, string memory _stateVar) external view returns (int256) {
    return _getNodeStateVal(tokenId, _nodeId, _stateVar);
  }

  function setNodeIntStateVal(uint16 tokenId, uint16 _nodeId, string memory _stateVar, int256 val) external {
    _setNodeIntStateVal(tokenId, _nodeId, _stateVar, val);
  }

  function writeToIntOutput(uint16 tokenId, uint16 _nodeId, uint8 _socketId, int256 val) external {
    _writeToIntOutput(tokenId, _nodeId, _socketId, val);
  }

  function getBoolInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName) external view returns (bool) {
    return _getBoolInputVal(tokenId, _nodeId, _socketName);
  }

  function getInputValueType(uint16 tokenId, uint16 _nodeId) external view returns (ValueType) {
    return _inputValueTypes[tokenId][_nodeId];
  }

  function getStringInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName) external view returns (string memory) {
    return _getStringInputVal(tokenId, _nodeId, _socketName);
  }

  function getIntInputVal(uint16 tokenId, uint16 _nodeId, uint8 _socketName) external view returns (int256) {
    return _getIntInputVal(tokenId, _nodeId, _socketName);
  }

  function setVariable(uint16 tokenId, string memory socketName, int256 val) external {
    _setVariable(tokenId, socketName, val);
  }

  function setVariable(uint16 tokenId, string memory socketName, bool val) external {
    _setVariable(tokenId, socketName, val);
  }

  // function getSocketNames() public pure returns(SocketNames memory) {
  //     return SocketNames(IN_OUT_SOCKET_A, IN_OUT_SOCKET_B, IN_OUT_SOCKET_RESULT, FLOW_SOCKET_NAME, GATE_TRUE_SOCKET_NAME, GATE_FALSE_SOCKET_NAME, VARIABLE_NAME_SOCKET);
  // }

  function _getEdge(uint16 tokenId, uint16 _nodeId, uint8 _socketIndex) private view returns (EdgeToNode memory) {
    EdgeToNode memory edge = _tokenEdges[tokenId][_nodeId][_socketIndex];
    return edge;
  }

  function triggerEdge(uint16 tokenId, uint16 _nodeId, uint8 _socketIndex) external override {
    _triggerEdge(tokenId, _nodeId, _socketIndex);
  }

  function _triggerEdge(uint16 tokenId, uint16 _nodeId, uint8 _socketIndex) private {
    EdgeToNode memory edge = _getEdge(tokenId, _nodeId, _socketIndex);
    // console.log("triggering edge to node: %i %i %b", edge.toNode, edge.toSocket, edge.set);
    if (edge.set) {
      _triggerNode(tokenId, edge.toNode, edge.toSocket);
    }
  }

  function _writeToIntOutput(uint16 tokenId, uint16 _nodeId, uint8 _socketId, int256 val) private {
    // get the edge to the next node
    EdgeToNode memory edge = _getEdge(tokenId, _nodeId, _socketId);

    // if the edge exists
    if (edge.set) {
      // write the node value to the input socket
      _setIntInputVal(tokenId, edge.toNode, edge.toSocket, val);

      // if is an immediate node, exec it
      _exec(tokenId, edge.toNode);
    }
  }

  function _exec(uint16 tokenId, uint16 _nodeId) private {
    NodeType nodeType = _getNodeType(tokenId, _nodeId);
    if (nodeType == NodeType.Add) {
      // get the value from input a and input b
      (new Add()).execute(this, tokenId, _nodeId);
    }
  }

  function _isImmediateNode(uint16 tokenId, uint16 _nodeId) private view returns (bool) {
    NodeType nodeType = _getNodeType(tokenId, _nodeId);
    return nodeType == NodeType.Add;
  }

  function _triggerNode(uint16 tokenId, uint16 _nodeId, uint8 _triggeringSocketIndex) internal {
    // get the node type
    NodeType nodeType = _getNodeType(tokenId, _nodeId);

    if (nodeType == NodeType.Counter) {
      (new Counter()).trigger(this, tokenId, _nodeId, _triggeringSocketIndex);
    } else if (nodeType == NodeType.Gate) {
      (new Gate()).trigger(this, tokenId, _nodeId, _triggeringSocketIndex);
    } else if (nodeType == NodeType.VariableSet) {
      (new VariableSet()).trigger(this, tokenId, _nodeId, _triggeringSocketIndex);
    } else {
      revert InvalidActionId(_nodeId);
    }
  }

  function trigger(uint16 _tokenId, string memory _nodeId) public {
    uint16 _nodeIndex = _getNodeIndex(_tokenId, _nodeId);
    NodeType _nodeType = _getNodeType(_tokenId, _nodeIndex);

    // console.log("node id %s %i %i ",_nodeId, _nodeIndex, uint8(_nodeType));
    if (_nodeType != NodeType.ExternalTrigger) {
      revert CannotTriggerExternally(_nodeIndex);
    }

    // todo: rethink
    _triggerEdge(_tokenId, _nodeIndex, 0);
  }
}
