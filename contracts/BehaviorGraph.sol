// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

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
   string[] inputSockets;
   string[] outputSockets;
}

struct NodeDefinitionAndValues {
  NodeDefinition definition;
  InitialValues initialValues;
}

struct EdgeDefinition {
  string fromNode;
  string toNode;
  string fromSocket;
  string toSocket;
}

struct EdgeToNode {
  uint128 toNode;
  uint8 toSocket;
  bool set;
}

string constant IN_OUT_SOCKET_A = 'a';
string constant IN_OUT_SOCKET_B = 'b';
string constant IN_OUT_SOCKET_RESULT = 'result';
string constant FLOW_SOCKET_NAME = 'flow';
string constant GATE_TRUE_SOCKET_NAME = 'true';
string constant GATE_FALSE_SOCKET_NAME ='false';
string constant VARIABLE_NAME_SOCKET = 'variableName';

struct SocketNames{
  string inOutSocketA;
  string inOutSocketB;
  string inOutSocketResult;
  string flowSocketName;
  string gateTrueSocketName;
  string gateFalseSocketName;
  string variableNameSocket;
}


contract BehaviorGraph is ERC721, ERC721URIStorage, Ownable, NodeState, HasVariables, SocketsIndexedByName {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => mapping(string => uint128)) private _nodeIndeces;
    // edges between nodes, indexed by token id, node index, and socket index
    mapping(uint256 => mapping(uint128 => mapping(uint8 => EdgeToNode))) private _tokenEdges;

    // node node definition, mapped by node index and token id
    mapping(uint256 => mapping(uint128 => NodeType)) private _nodeTypes;
    mapping(uint256 => mapping(uint128 => ValueType)) private _inputValueTypes;
    event SafeMint(uint256 tokenId, address toNode, string uri, NodeDefinitionAndValues[] nodes);

    error InvalidActionId(uint128 nodeId);
    error CannotTriggerExternally(uint128 nodeId);
    error MissingTokens(string nodeId, address tokenAddress);

    constructor() ERC721("MyToken", "MTK") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(string memory sceneUri, NodeDefinitionAndValues[] calldata _nodes, EdgeDefinition[] calldata _edges) public returns(uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        address to = msg.sender;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, sceneUri);
        _createNodes(tokenId, _nodes, _edges);
        emit SafeMint(tokenId, to, sceneUri, _nodes);
    
        return tokenId;
    }

  
    function _nodeIndex(uint256 tokenId, string memory nodeId) private view returns(uint128) {
        return _nodeIndeces[tokenId][nodeId];
    }

    function _getNodeType(uint256 tokenId, uint128 nodeIndex) private view returns(NodeType) {
        return _nodeTypes[tokenId][nodeIndex];
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    } 

    

    function _createNodes(uint256 tokenId, NodeDefinitionAndValues[] calldata _nodes, EdgeDefinition[] calldata _edges) private {
      // for each node definition and values, create a node and set the initial values
      for(uint256 i = 0; i < _nodes.length; i++) {
          NodeDefinitionAndValues calldata nodeAndValues = _nodes[i];
          NodeDefinition calldata node = nodeAndValues.definition;
          uint128 nodeIndex = _nodeIndex(tokenId, node.id);
          NodeType nodeType = node.nodeType;

          _nodeTypes[tokenId][nodeIndex] = nodeType;
          _inputValueTypes[tokenId][nodeIndex] = node.inputValueType;

          _setInitialValues(tokenId, nodeIndex, nodeAndValues.initialValues);
        
          // store the indeces for the sockets, so that they can be mapped by int later.
          _setInputOutputNodeSocketIndeces(nodeType, node.inputSockets, node.outputSockets);
        }
      for(uint256 i = 0; i < _edges.length; i++) {
        EdgeDefinition calldata edge = _edges[i];

        uint128 fromNode = _nodeIndex(tokenId, edge.fromNode);
        uint128 toNode = _nodeIndex(tokenId, edge.toNode);
        NodeType fromNodeType = _getNodeType(tokenId, fromNode);
        uint8 fromSocket = getInputNodeSocketIndex(fromNodeType, edge.fromSocket);

        // get the to node type
        NodeType toNodeType = _getNodeType(tokenId, toNode);
        uint8 toSocket = getOutputNodeSocketIndex(toNodeType, edge.toSocket);

        _tokenEdges[tokenId][fromNode][fromSocket] = EdgeToNode(toNode, toSocket, true);
      }
    }

    function getSocketNames() public pure returns(SocketNames memory) {
        return SocketNames(IN_OUT_SOCKET_A, IN_OUT_SOCKET_B, IN_OUT_SOCKET_RESULT, FLOW_SOCKET_NAME, GATE_TRUE_SOCKET_NAME, GATE_FALSE_SOCKET_NAME, VARIABLE_NAME_SOCKET);
    }

    function _getEdge(uint256 tokenId, uint128 _nodeId, uint8 _socketIndex) private view returns(EdgeToNode memory) {
        EdgeToNode memory edge = _tokenEdges[tokenId][_nodeId][_socketIndex];
        return edge;
    }

    function _triggerEdge(uint256 tokenId, uint128 _nodeId, NodeType nodeType, string memory _label) private {
      uint8 _socketIndex = getOutputNodeSocketIndex(nodeType, _label);
      EdgeToNode memory edge = _getEdge(tokenId, _nodeId, _socketIndex);
      if(edge.set) {
        _triggerNode(tokenId, edge.toNode, edge.toSocket);
      }
    }

    function _writeToIntOutput(uint256 tokenId, uint128 _nodeId, NodeType nodeType, string memory outputSocketName, int256 val) private {
      uint8 _socketId = getOutputNodeSocketIndex(nodeType, outputSocketName);
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

    function _getIntInputVal(uint256 tokenId, uint128 _nodeId, NodeType nodeType, string memory socketName) private view returns(int256) {
        uint8 socketId = getInputNodeSocketIndex(nodeType, socketName);
        return getIntInputVal(tokenId, _nodeId, socketId);
    }

    function _exec(uint256 tokenId, uint128 _nodeId) private {
        NodeType nodeType = _getNodeType(tokenId, _nodeId);
        if(nodeType == NodeType.Add) {
            // get the value from input a and input b
            int256 val = _getIntInputVal(tokenId, _nodeId, nodeType, IN_OUT_SOCKET_A) 
                       + _getIntInputVal(tokenId, _nodeId, nodeType, IN_OUT_SOCKET_B);
        
            _writeToIntOutput(tokenId, _nodeId, nodeType, IN_OUT_SOCKET_RESULT, val);
        } 
    }

    function _isImmediateNode(uint256 tokenId, uint128 _nodeId) private view returns(bool) {
        NodeType nodeType = _getNodeType(tokenId, _nodeId);
        return nodeType == NodeType.Add;
    }

    function getStringInputVal(uint256 tokenId, uint128 _nodeId, NodeType _nodeType, string memory _socketName) public view returns(string memory) {
        uint8 socketIndex = getInputNodeSocketIndex(_nodeType, _socketName);
        return getStringInputVal(tokenId, _nodeId, socketIndex);
    }


    // overloaded function that looks up by socket name 
    function _getBoolInputVal(uint256 tokenId, uint128 _nodeId, NodeType _nodeType, string memory _socketName) public view returns(bool) {
      uint8 socketIndex = getInputNodeSocketIndex(_nodeType, _socketName);
    
      // call overloaded function that looks up by socket index
      return _getBoolInputVal(tokenId, _nodeId, socketIndex);
    }

    function _triggerNode(uint256 tokenId, uint128 _nodeId, uint8 _triggeringSocketName) public {
        // get the node type
        NodeType nodeType = _getNodeType(tokenId, _nodeId);
        
        if (nodeType == NodeType.Counter) {
          // update state to increment counter
          // this is internal, so we dont need to store it in constant
          int256 newStateVal = getNodeStateVal(tokenId, _nodeId, "count") + 1;
          _setNodeIntStateVal(tokenId, _nodeId, "count", newStateVal);
          // trigger the flow edge

          _writeToIntOutput(tokenId, _nodeId, nodeType, IN_OUT_SOCKET_A, newStateVal);
          _triggerEdge(tokenId, _nodeId, nodeType, FLOW_SOCKET_NAME);
        } else if (nodeType == NodeType.Gate) {
          // get the socket to trigger
          string memory toTrigger = getBoolInputVal(tokenId, _nodeId, _triggeringSocketName) ? GATE_TRUE_SOCKET_NAME : GATE_FALSE_SOCKET_NAME;
          // trigger the flow edge along that socket
          _triggerEdge(tokenId, _nodeId, nodeType, toTrigger);
        } else if (nodeType == NodeType.VariableSet) {
          // emit that variable is updated, notifiying the outside world
          // if it is an int variable
          string memory variableSocketName = getStringInputVal(tokenId, _nodeId, nodeType, VARIABLE_NAME_SOCKET);

          ValueType _inputValueType = _inputValueTypes[tokenId][_nodeId];
          if (_inputValueType == ValueType.Int) {
            _setIntVariable(tokenId, variableSocketName, _getIntInputVal(tokenId, _nodeId, nodeType, IN_OUT_SOCKET_A));
          } else {
            _setBoolVariable(tokenId, variableSocketName, _getBoolInputVal(tokenId, _nodeId, nodeType, IN_OUT_SOCKET_A));
          }
        } else {
          revert InvalidActionId(_nodeId);
        }
    }

    function trigger(uint256 _tokenId, uint128 _nodeId) public {
        NodeType _nodeType = _getNodeType(_tokenId, _nodeId);
        
        if (_nodeType != NodeType.ExternalTrigger) {
          revert CannotTriggerExternally(_nodeId);
        }

        _triggerEdge(_tokenId, _nodeId, _nodeType, FLOW_SOCKET_NAME);
    }
}