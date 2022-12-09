// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import './NodeState.sol';

enum ValueType {
  Int,
  Bool,
  NotAVariable
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

contract BehaviorGraph is ERC721, ERC721URIStorage, Ownable, NodeState, HasVariables, SocketsIndexedByName {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  mapping(uint16 => mapping(string => uint16)) private _nodeIndeces;
  // edges between nodes, indexed by token id, node index, and socket index
  mapping(uint16 => mapping(uint16 => mapping(uint8 => EdgeToNode))) private _tokenEdges;

  // node node definition, mapped by node index and token id
  mapping(uint16 => mapping(uint16 => NodeType)) private _nodeTypes;
  mapping(uint16 => mapping(uint16 => ValueType)) private _inputValueTypes;
  event SafeMint(uint256 tokenId, address toNode, string uri, NodeDefinitionAndValues[] nodes);

  error InvalidActionId(uint16 nodeId);
  error CannotTriggerExternally(uint16 nodeId);
  error MissingTokens(string nodeId, address tokenAddress);

  constructor() ERC721('MyToken', 'MTK') {}

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://';
  }

  function safeMint(
    string memory sceneUri,
    NodeDefinitionAndValues[] calldata _nodes,
    EdgeDefinition[] calldata _edges
  ) public returns (uint256) {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    address to = msg.sender;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, sceneUri);
    // todo - fix overflow with uint16
    _createNodes(uint16(tokenId), _nodes, _edges);
    emit SafeMint(tokenId, to, sceneUri, _nodes);

    return tokenId;
  }

  function _getNodeIndex(uint16 tokenId, string memory nodeId) private view returns (uint16) {
    return _nodeIndeces[tokenId][nodeId];
  }

  function _getNodeType(uint16 tokenId, uint16 nodeIndex) private view returns (NodeType) {
    return _nodeTypes[tokenId][nodeIndex];
  }

  // The following functions are overrides required by Solidity.
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _createNodes(
    uint16 tokenId,
    NodeDefinitionAndValues[] calldata _nodes,
    EdgeDefinition[] calldata _edges
  ) private {
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

  // function getSocketNames() public pure returns(SocketNames memory) {
  //     return SocketNames(IN_OUT_SOCKET_A, IN_OUT_SOCKET_B, IN_OUT_SOCKET_RESULT, FLOW_SOCKET_NAME, GATE_TRUE_SOCKET_NAME, GATE_FALSE_SOCKET_NAME, VARIABLE_NAME_SOCKET);
  // }

  function _getEdge(uint16 tokenId, uint16 _nodeId, uint8 _socketIndex) private view returns (EdgeToNode memory) {
    EdgeToNode memory edge = _tokenEdges[tokenId][_nodeId][_socketIndex];
    return edge;
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
    SocketIndecesByNodeType memory socketIndeces = getSocketIndecesByNodeType();
    if (nodeType == NodeType.Add) {
      // get the value from input a and input b
      int256 val = getIntInputVal(tokenId, _nodeId, socketIndeces.add.input1) +
        getIntInputVal(tokenId, _nodeId, socketIndeces.add.input2);

      _writeToIntOutput(tokenId, _nodeId, socketIndeces.add.result, val);
    }
  }

  function _isImmediateNode(uint16 tokenId, uint16 _nodeId) private view returns (bool) {
    NodeType nodeType = _getNodeType(tokenId, _nodeId);
    return nodeType == NodeType.Add;
  }

  function _triggerCounter(uint16 tokenId, uint16 _nodeId) private {
    // update state to increment counter
    // this is internal, so we dont need to store it in constant
    int256 newStateVal = getNodeStateVal(tokenId, _nodeId, 'count') + 1;
    _setNodeIntStateVal(tokenId, _nodeId, 'count', newStateVal);

    SocketIndecesByNodeType memory socketIndeces = getSocketIndecesByNodeType();
    // write the count to the output
    _writeToIntOutput(tokenId, _nodeId, socketIndeces.counter.outputCount, newStateVal);
    // trigger the flow edge
    _triggerEdge(tokenId, _nodeId, socketIndeces.counter.outputFlow);
  }

  function _triggerGate(uint16 tokenId, uint16 _nodeId, uint8 _triggeringSocketIndex) private {
    SocketIndecesByNodeType memory socketIndeces = getSocketIndecesByNodeType();
    // get the socket to trigger
    uint8 toTrigger = getBoolInputVal(tokenId, _nodeId, _triggeringSocketIndex)
      ? socketIndeces.gate.outputGateTrue
      : socketIndeces.gate.outputGateFalse;
    // trigger the flow edge along that socket
    _triggerEdge(tokenId, _nodeId, toTrigger);
  }

  function _triggerVariableSet(uint16 tokenId, uint16 _nodeId) private {
    SocketIndecesByNodeType memory socketIndeces = getSocketIndecesByNodeType();
    string memory variableSocketName = getStringInputVal(tokenId, _nodeId, socketIndeces.variableSet.variableName);

    // determine what type of value is stored
    ValueType _inputValueType = _inputValueTypes[tokenId][_nodeId];
    // if it is an int variable
    if (_inputValueType == ValueType.Int) {
      setVariable(tokenId, variableSocketName, getIntInputVal(tokenId, _nodeId, socketIndeces.variableSet.inputVal));
    } else {
      setVariable(tokenId, variableSocketName, getBoolInputVal(tokenId, _nodeId, socketIndeces.variableSet.inputVal));
    }
  }

  function _triggerNode(uint16 tokenId, uint16 _nodeId, uint8 _triggeringSocketIndex) internal {
    // get the node type
    NodeType nodeType = _getNodeType(tokenId, _nodeId);

    if (nodeType == NodeType.Counter) {
      _triggerCounter(tokenId, _nodeId);
    } else if (nodeType == NodeType.Gate) {
      _triggerGate(tokenId, _nodeId, _triggeringSocketIndex);
    } else if (nodeType == NodeType.VariableSet) {
      _triggerVariableSet(tokenId, _nodeId);
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
    SocketIndecesByNodeType memory socketIndeces = getSocketIndecesByNodeType();

    _triggerEdge(_tokenId, _nodeIndex, socketIndeces.externalTrigger.outputFlowSocket);
  }
}
