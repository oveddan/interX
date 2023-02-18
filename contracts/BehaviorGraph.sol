// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

import './Interfaces.sol';
import './Nodes.sol';
import './NodeState.sol';

enum NodeType {
  ExternalInvoke,
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

struct NodeConfig {
  uint8 variableId;
  uint8 invocationId;
  bool invocationNameDefined;
  bool variableIdDefined;
}

struct NodeDefinitionAndValues {
  NodeDefinition definition;
  InitialValues initialValues;
  NodeConfig config;
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
  uint256 private _id;
  mapping(string => uint16) private _nodeIndeces;
  // edges between nodes, indexed by token id, node index, and socket index
  mapping(uint16 => mapping(uint8 => EdgeToNode)) private _tokenEdges;

  // node node definition, mapped by node index and token id
  mapping(uint16 => NodeType) private _nodeTypes;
  mapping(uint16 => ValueType) private _inputValueTypes;
  mapping(uint16 => uint8) private _nodeVariableIds;
  mapping(uint8 => uint16) private _invocationNodes;

  error InvalidActionId(uint16 nodeId);
  error CannotTriggerExternally(uint16 nodeId);

  SocketIndecesByNodeType private _socketIndecesByNodeType;

  constructor(
    uint256 id,
    NodeDefinitionAndValues[] memory _nodes,
    EdgeDefinition[] memory _edges,
    SocketIndecesByNodeType memory socketIndecesByNodeType
  ) {
    _socketIndecesByNodeType = socketIndecesByNodeType;
    _id = id;

    // for each node definition and values, create a node and set the initial values
    for (uint16 nodeIndex = 0; nodeIndex < _nodes.length; nodeIndex++) {
      NodeDefinitionAndValues memory nodeAndValues = _nodes[nodeIndex];
      NodeDefinition memory node = nodeAndValues.definition;
      NodeType nodeType = node.nodeType;
      NodeConfig memory nodeConfig = nodeAndValues.config;

      _nodeIndeces[node.id] = nodeIndex;
      _nodeTypes[nodeIndex] = nodeType;
      _inputValueTypes[nodeIndex] = node.inputValueType;
      if (nodeConfig.variableIdDefined) _nodeVariableIds[nodeIndex] = nodeConfig.variableId;
      if (nodeConfig.invocationNameDefined) _invocationNodes[nodeConfig.invocationId] = nodeIndex;

      _setInitialValues(nodeIndex, nodeAndValues.initialValues);

      // store the indeces for the sockets, so that they can be mapped by int later.
      // _setInputOutputNodeSocketIndeces(nodeType, node.inputSockets, node.outputSockets);
    }
    for (uint16 i = 0; i < _edges.length; i++) {
      EdgeDefinition memory edge = _edges[i];

      uint16 fromNode = _getNodeIndex(edge.fromNode);
      uint16 toNode = _getNodeIndex(edge.toNode);
      uint8 fromSocket = edge.fromSocket;

      // get the to node type
      uint8 toSocket = edge.toSocket;

      _tokenEdges[fromNode][fromSocket] = EdgeToNode(toNode, toSocket, true);
    }
  }

  function _getNodeIndex(string memory nodeId) private view returns (uint16) {
    return _nodeIndeces[nodeId];
  }

  function _getNodeType(uint16 nodeIndex) private view returns (NodeType) {
    return _nodeTypes[nodeIndex];
  }

  function getNodeStateVal(uint16 _nodeId, string memory _stateVar) external view returns (int256) {
    return _getNodeStateVal(_nodeId, _stateVar);
  }

  function setNodeIntStateVal(uint16 _nodeId, string memory _stateVar, int256 val) external {
    _setNodeIntStateVal(_nodeId, _stateVar, val);
  }

  function writeToOutput(uint16 _nodeId, uint8 _socketId, int256 val) external {
    _writeToIntOutput(_nodeId, _socketId, val);
  }

  function getBoolInputVal(uint16 _nodeId, uint8 _socketName) external view returns (bool) {
    return _getBoolInputVal(_nodeId, _socketName);
  }

  function getInputValueType(uint16 _nodeId) external view returns (ValueType) {
    return _inputValueTypes[_nodeId];
  }

  function getStringInputVal(uint16 _nodeId, uint8 _socketName) external view returns (string memory) {
    return _getStringInputVal(_nodeId, _socketName);
  }

  function getIntInputVal(uint16 _nodeId, uint8 _socketName) external view returns (int256) {
    return _getIntInputVal(_nodeId, _socketName);
  }

  function setVariable(uint8 variableId, int256 val) external {
    _setVariable(variableId, val);
  }

  function setVariable(uint8 variableId, bool val) external {
    _setVariable(variableId, val);
  }

  // function getSocketNames() public pure returns(SocketNames memory) {
  //     return SocketNames(IN_OUT_SOCKET_A, IN_OUT_SOCKET_B, IN_OUT_SOCKET_RESULT, FLOW_SOCKET_NAME, GATE_TRUE_SOCKET_NAME, GATE_FALSE_SOCKET_NAME, VARIABLE_NAME_SOCKET);
  // }

  function _getEdge(uint16 _nodeId, uint8 _socketIndex) private view returns (EdgeToNode memory) {
    EdgeToNode memory edge = _tokenEdges[_nodeId][_socketIndex];
    return edge;
  }

  function triggerEdge(uint16 _nodeId, uint8 _socketIndex) external override returns (GraphUpdate[] memory) {
    return _triggerEdge(_nodeId, _socketIndex);
  }

  function _triggerEdge(uint16 _nodeId, uint8 _socketIndex) private returns (GraphUpdate[] memory) {
    EdgeToNode memory edge = _getEdge(_nodeId, _socketIndex);
    // console.log("triggering edge to node: %i %i %b", edge.toNode, edge.toSocket, edge.set);
    if (edge.set) {
      return _triggerNode(edge.toNode, edge.toSocket);
    }

    return new GraphUpdate[](0);
  }

  function _writeToIntOutput(uint16 _nodeId, uint8 _socketId, int256 val) private {
    // get the edge to the next node
    EdgeToNode memory edge = _getEdge(_nodeId, _socketId);

    // if the edge exists
    if (edge.set) {
      // write the node value to the input socket
      _setInputVal(edge.toNode, edge.toSocket, val);

      // if is an immediate node, exec it
      _exec(edge.toNode);
    }
  }

  function _exec(uint16 _nodeId) private {
    NodeType nodeType = _getNodeType(_nodeId);
    if (nodeType == NodeType.Add) {
      // get the value from input a and input b
      (new Add(_socketIndecesByNodeType.add)).execute(this, _nodeId);
    }
  }

  function _isImmediateNode(uint16 _nodeId) private view returns (bool) {
    NodeType nodeType = _getNodeType(_nodeId);
    return nodeType == NodeType.Add;
  }

  function _triggerNode(uint16 _nodeId, uint8 _triggeringSocketIndex) internal returns (GraphUpdate[] memory) {
    // get the node type
    NodeType nodeType = _getNodeType(_nodeId);

    ITriggerNode triggerNode;

    if (nodeType == NodeType.Counter) {
      triggerNode = new Counter(_socketIndecesByNodeType.counter);
    } else if (nodeType == NodeType.Gate) {
      triggerNode = new Gate(_socketIndecesByNodeType.gate);
    } else if (nodeType == NodeType.VariableSet) {
      uint8 variableId = _nodeVariableIds[_nodeId];
      triggerNode = new VariableSet(_socketIndecesByNodeType.variableSet, variableId);
    } else {
      revert InvalidActionId(_nodeId);
    }

    return triggerNode.trigger(this, _nodeId, _triggeringSocketIndex);
  }

  function invoke(uint8 _invocationId) public returns (GraphUpdate[] memory) {
    uint16 _nodeIndex = _invocationNodes[_invocationId];
    NodeType _nodeType = _getNodeType(_nodeIndex);

    // console.log("node id %s %i %i ",_nodeId, _nodeIndex, uint8(_nodeType));
    if (_nodeType != NodeType.ExternalInvoke) {
      revert CannotTriggerExternally(_nodeIndex);
    }

    // todo: rethink
    return (new ExternalInvoke(_socketIndecesByNodeType.externalInvoke)).trigger(this, _nodeIndex, 0);
  }
}
