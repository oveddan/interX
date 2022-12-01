// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

enum NodeType {
  Counter,
  Add,
  Gate,
  Variable
}

enum VariableType {
    Int,
    Bool,
    NotAVariable
}

struct NodeDefinition {
   string id;
   NodeType nodeType;
   bool defined;
   // will only be set if this is a variable
   VariableType variableType;
   string variableName;
}



// struct NodeVals {
//   uint256 intValA;
//   uint256 intValB;
//   uint256 intValC;
//   bool boolValA;
//   bool boolValB;
//   bool boolValC;
//   uint256 intStateValA;
//   uint256 intStateValB;
//   bool boolStateValA;
//   bool boolStateValB;
// }

struct EdgeDefinition {
  string from;
  string to;
  string fromLabel;
  string toSocket;
}

struct EdgeToNode {
  string to;
  string toSocket;
  bool set;
}

string constant IN_OUT_SOCKET_A = "a";
string constant IN_OUT_SOCKET_B = "b";
string constant IN_OUT_SOCKET_RESULT = "result";
string constant FLOW_SOCKET_NAME = "flow";
string constant GATE_TRUE_SOCKET_NAME = "true";
string constant GATE_FALSE_SOCKET_NAME = "false";

struct SocketNames{
    string inOutSocketA;
    string inOutSocketB;
    string inOutSocketResult;
    string flowSocketName;
    string gateTrueSocketName;
    string gateFalseSocketName;
}


contract BehaviorGraph is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    mapping(uint256 => mapping(string => NodeDefinition)) private _nodeDefinition;
    mapping(uint256 => mapping(string => mapping(string => uint256))) private _nodeInputIntVals;
    mapping(uint256 => mapping(string => mapping(string => uint256))) private _nodeStateVals;
    mapping(uint256 => mapping(string => mapping(string => bool))) private _nodeBoolVals;
    mapping(uint256 => mapping(string => mapping(string => EdgeToNode))) private _tokenEdges;
    mapping(uint256 => mapping(string => uint256)) private _tokenNodeEmitCount;

    Counters.Counter private _tokenIdCounter;

    event SafeMint(uint256 tokenId, address to, string uri, NodeDefinition[] nodes);

    error InvalidActionId(string nodeId);
    error MissingTokens(string nodeId, address tokenAddress);

    event IntVariableUpdated(address executor, uint256 tokenId, string variableId, uint256 value);
    event BoolVariableUpdated(address executor, uint256 tokenId, string variableId, bool value);

    constructor() ERC721("MyToken", "MTK") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(string memory sceneUri, NodeDefinition[] calldata _nodes, EdgeDefinition[] calldata _edges) public returns(uint256) {
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

    function _createNodes(uint256 tokenId, NodeDefinition[] calldata _nodes, EdgeDefinition[] calldata _edges) private {
        for(uint256 i = 0; i < _nodes.length; i++) {
          NodeDefinition calldata node = _nodes[i];
          _nodeDefinition[tokenId][node.id] = node;
        }
        for(uint256 i = 0; i < _edges.length; i++) {
          EdgeDefinition calldata edge = _edges[i];
          _tokenEdges[tokenId][edge.from][edge.fromLabel] = EdgeToNode(edge.to, edge.toSocket, true);
        }
    }

    function getSocketNames() public pure returns(SocketNames memory) {
        return SocketNames(IN_OUT_SOCKET_A, IN_OUT_SOCKET_B, IN_OUT_SOCKET_RESULT, FLOW_SOCKET_NAME, GATE_TRUE_SOCKET_NAME, GATE_FALSE_SOCKET_NAME);
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
        trigger(tokenId, edge.to, edge.toSocket);
      }
    }

    function _writeToIntOutput(uint256 tokenId, string memory _nodeId, string memory _socketName, uint256 val) private {
      // get the edge to the next node
      EdgeToNode memory edge = _getEdge(tokenId, _nodeId, _socketName);

      // if the edge exists
      if (edge.set) {
        // write the node value to the input socket
        _nodeInputIntVals[tokenId][edge.to][edge.toSocket] = val;
      
        // if is an immediate node, exec it
        _exec(tokenId, edge.to);
      }
    }

    function _getNodeInputVal(uint256 tokenId, string memory _nodeId, string memory _socketName) private view returns(uint256) {
      return _nodeInputIntVals[tokenId][_nodeId][_socketName];
    }

    function _exec(uint256 tokenId, string memory _nodeId) private {
        NodeDefinition memory node = _nodeDefinition[tokenId][_nodeId];
        if(node.nodeType == NodeType.Add) {
            // get the value from input a and input b
            uint256 val = _getNodeInputVal(tokenId, _nodeId, IN_OUT_SOCKET_A) + _getNodeInputVal(tokenId, _nodeId, IN_OUT_SOCKET_B);
        
            _writeToIntOutput(tokenId, _nodeId, IN_OUT_SOCKET_RESULT, val);
        } 
    }

    function _isImmediateNode(uint256 tokenId, string memory _nodeId) private view returns(bool) {
        NodeDefinition memory node = _nodeDefinition[tokenId][_nodeId];
        return node.nodeType == NodeType.Add;
    }

    function trigger(uint256 tokenId, string memory _nodeId, string memory _triggeringSocketName) public {
        NodeDefinition memory node = getNodeDefinition(tokenId, _nodeId);
        
        if (node.nodeType == NodeType.Counter) {
          // update state to increment counter
          // this is internal, so we dont need to store it in constant
          _nodeStateVals[tokenId][_nodeId]["count"] += 1;
          // trigger the flow edge
          _writeToIntOutput(tokenId, _nodeId, IN_OUT_SOCKET_A, _nodeStateVals[tokenId][_nodeId]["count"]);
          _triggerEdge(tokenId, _nodeId, FLOW_SOCKET_NAME);
        } else if (node.nodeType == NodeType.Gate) {
          // get the socket to trigger
          string memory toTrigger = _nodeBoolVals[tokenId][_nodeId][_triggeringSocketName] ? GATE_TRUE_SOCKET_NAME : GATE_FALSE_SOCKET_NAME;
          // trigger the flow edge along that socket
          _triggerEdge(tokenId, _nodeId, toTrigger);
        } else if (node.nodeType == NodeType.Variable) {
          // emit that variable is updated, notifiying the outside world
          // if it is an int variable
          if (node.variableType == VariableType.Int) {
            emit IntVariableUpdated(msg.sender, tokenId, node.variableName, _nodeInputIntVals[tokenId][_nodeId][IN_OUT_SOCKET_A]);
          } else {
            emit BoolVariableUpdated(msg.sender, tokenId, node.variableName, _nodeBoolVals[tokenId][_nodeId][IN_OUT_SOCKET_A]);
          }
        } else {
          revert InvalidActionId(_nodeId);
        }
    }
}
