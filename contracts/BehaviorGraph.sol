// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

import './NodeState.sol';


enum NodeType {
  ExternalTrigger,
  Counter,
  Add,
  Gate,
  VariableSet 
}

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
  string fromSocket;
  string toSocket;
}

struct EdgeToNode {
  string toNode;
  string toSocket;
  bool set;
}

string constant IN_OUT_SOCKET_A = "a";
string constant IN_OUT_SOCKET_B = "b";
string constant IN_OUT_SOCKET_RESULT = "result";
string constant FLOW_SOCKET_NAME = "flow";
string constant GATE_TRUE_SOCKET_NAME = "true";
string constant GATE_FALSE_SOCKET_NAME = "false";
string constant VARIABLE_NAME_SOCKET = "variableName";

struct SocketNames{
    string inOutSocketA;
    string inOutSocketB;
    string inOutSocketResult;
    string flowSocketName;
    string gateTrueSocketName;
    string gateFalseSocketName;
    string variableNameSocket;
}


contract BehaviorGraph is ERC721, ERC721URIStorage, Ownable, NodeState  {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => mapping(string => NodeDefinition)) private _nodeDefinition;
    mapping(uint256 => mapping(string => int256)) private _intVarVals;
    mapping(uint256 => mapping(string => bool)) private _boolVarVals;
    mapping(uint256 => mapping(string => mapping(string => EdgeToNode))) private _tokenEdges;

    event SafeMint(uint256 tokenId, address toNode, string uri, NodeDefinitionAndValues[] nodes);

    error InvalidActionId(string nodeId);
    error CannotTriggerExternally(string nodeId);
    error MissingTokens(string nodeId, address tokenAddress);

    event IntVariableUpdated(address executor, uint256 tokenId, string variableName, int256 value);
    event BoolVariableUpdated(address executor, uint256 tokenId, string variableName, bool value);

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
        for(uint256 i = 0; i < _nodes.length; i++) {
          NodeDefinitionAndValues calldata nodeAndValues = _nodes[i];
          NodeDefinition calldata node = nodeAndValues.definition;
          _nodeDefinition[tokenId][node.id] = node;

          _setInitialValues(tokenId, node.id, nodeAndValues.initialValues);
        }
        for(uint256 i = 0; i < _edges.length; i++) {
          EdgeDefinition calldata edge = _edges[i];
          _tokenEdges[tokenId][edge.fromNode][edge.fromSocket] = EdgeToNode(edge.toNode, edge.toSocket, true);
        }
    }

    function getSocketNames() public pure returns(SocketNames memory) {
        return SocketNames(IN_OUT_SOCKET_A, IN_OUT_SOCKET_B, IN_OUT_SOCKET_RESULT, FLOW_SOCKET_NAME, GATE_TRUE_SOCKET_NAME, GATE_FALSE_SOCKET_NAME, VARIABLE_NAME_SOCKET);
    }

    function getNodeDefinition(uint256 tokenId, string memory _nodeId) public view returns(NodeDefinition memory) {
        return _nodeDefinition[tokenId][_nodeId];
    }

    function _getEdge(uint256 tokenId, string memory _nodeId, string memory _label) private view returns(EdgeToNode memory) {
        EdgeToNode memory edge = _tokenEdges[tokenId][_nodeId][_label];
        return edge;
    }

    function _triggerEdge(uint256 tokenId, string memory _nodeId, string memory _label) private {
      EdgeToNode memory edge = _getEdge(tokenId, _nodeId, _label);
      if(edge.set) {
        _triggerNode(tokenId, edge.toNode, edge.toSocket);
      }
    }

    function _writeToIntOutput(uint256 tokenId, string memory _nodeId, string memory _socketName, int256 val) private {
      // get the edge to the next node
      EdgeToNode memory edge = _getEdge(tokenId, _nodeId, _socketName);

      // if the edge exists
      if (edge.set) {
        // write the node value to the input socket
        _setIntInputVal(tokenId, edge.toNode, edge.toSocket, val);
      
        // if is an immediate node, exec it
        _exec(tokenId, edge.toNode);
      }
    }

    function _exec(uint256 tokenId, string memory _nodeId) private {
        NodeDefinition memory node = _nodeDefinition[tokenId][_nodeId];
        if(node.nodeType == NodeType.Add) {
            // get the value from input a and input b
            uint256 val = uint256(getIntInputVal(tokenId, _nodeId, IN_OUT_SOCKET_A)) + uint256(getIntInputVal(tokenId, _nodeId, IN_OUT_SOCKET_B));
        
        //     console.log('is add');
        //     _writeToIntOutput(tokenId, _nodeId, IN_OUT_SOCKET_RESULT, val);
        } 
    }

    function _isImmediateNode(uint256 tokenId, string memory _nodeId) private view returns(bool) {
        NodeDefinition memory node = _nodeDefinition[tokenId][_nodeId];
        return node.nodeType == NodeType.Add;
    }

    function _setIntVariable(uint256 tokenId, string memory _variableName, int256 val) private {
        _intVarVals[tokenId][_variableName] = val;
        emit IntVariableUpdated(msg.sender, tokenId, _variableName, val);
    }

    function getIntVariable(uint256 tokenId, string memory _variableName) public view returns(int256) {
        return _intVarVals[tokenId][_variableName];
    }

    function _setBoolVariable(uint256 tokenId, string memory _variableName, bool val) private {
        _boolVarVals[tokenId][_variableName] = val;
        emit BoolVariableUpdated(msg.sender, tokenId, _variableName, val);
    }

    function getBoolVariable(uint256 tokenId, string memory _variableName) public view returns(bool) {
        return _boolVarVals[tokenId][_variableName];
    }

    function _triggerNode(uint256 tokenId, string memory _nodeId, string memory _triggeringSocketName) public {
        NodeDefinition memory node = getNodeDefinition(tokenId, _nodeId);
        
        if (node.nodeType == NodeType.Counter) {
          // update state to increment counter
          // this is internal, so we dont need to store it in constant
          int256 newStateVal = getNodeStateVal(tokenId, _nodeId, "count") + 1;
          _setNodeIntStateVal(tokenId, _nodeId, "count", newStateVal);
          // trigger the flow edge

          console.log("triggering flow edge %i", uint256(newStateVal));
          _writeToIntOutput(tokenId, _nodeId, IN_OUT_SOCKET_A, newStateVal);
          _triggerEdge(tokenId, _nodeId, FLOW_SOCKET_NAME);
        } else if (node.nodeType == NodeType.Gate) {
          // get the socket to trigger
          string memory toTrigger = getBoolInputVal(tokenId, _nodeId, _triggeringSocketName) ? GATE_TRUE_SOCKET_NAME : GATE_FALSE_SOCKET_NAME;
          // trigger the flow edge along that socket
          _triggerEdge(tokenId, _nodeId, toTrigger);
        } else if (node.nodeType == NodeType.VariableSet) {
          // emit that variable is updated, notifiying the outside world
          // if it is an int variable
          string memory variableSocketName = getStringInputVal(tokenId, _nodeId, VARIABLE_NAME_SOCKET);

          if (node.inputValueType == ValueType.Int) {
            console.log("node input val %i", uint256(getIntInputVal(tokenId, _nodeId, IN_OUT_SOCKET_A)));
            _setIntVariable(tokenId, variableSocketName, getIntInputVal(tokenId, _nodeId, IN_OUT_SOCKET_A));
          } else {
            _setBoolVariable(tokenId, variableSocketName, getBoolInputVal(tokenId, _nodeId, IN_OUT_SOCKET_A));
          }
        } else {
          revert InvalidActionId(_nodeId);
        }
    }

    function trigger(uint256 _tokenId, string memory _nodeId) public {
        NodeDefinition memory node = getNodeDefinition(_tokenId, _nodeId);
        
        if (node.nodeType != NodeType.ExternalTrigger) {
          revert CannotTriggerExternally(_nodeId);
        }

        _triggerEdge(_tokenId, _nodeId, FLOW_SOCKET_NAME);
    }
}