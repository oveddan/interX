enum NodeType {
  ExternalTrigger,
  Counter,
  Add,
  Gate,
  VariableSet 
}

contract SocketsIndexedByName {
  // input node socket index to socket name, mapped by token id, node index, and socket name 
  mapping(NodeType => mapping(string => uint8)) private _inputNodeSocketIndeces;
  // output node socket index to socket name, mapped by node type 
  mapping(NodeType => mapping(string => uint8)) private _outputNodeSocketIndeces;

  constructor() {}

  function _setInputOutputNodeSocketIndeces(NodeType nodeType, string[] calldata inputSockets, string[] calldata outputSockets) internal {
    // set the input and output socket indeces for each input and output socket
    // of the node.  This is used to look up the socket index when by name.
    for(uint256 j = 0; j < inputSockets.length; j++) {
      _inputNodeSocketIndeces[nodeType][inputSockets[j]] = uint8(j);
    }
    for(uint256 j = 0; j < outputSockets.length; j++) {
      _outputNodeSocketIndeces[nodeType][outputSockets[j]] = uint8(j);
    }
  }

  function getInputNodeSocketIndex(NodeType nodeType, string memory socketName) public view returns(uint8) {
    return _inputNodeSocketIndeces[nodeType][socketName];
  }

  function getOutputNodeSocketIndex(NodeType nodeType, string memory socketName) public view returns(uint8) {
    return _outputNodeSocketIndeces[nodeType][socketName];
  }
}