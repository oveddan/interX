// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import './BehaviorGraph.sol';

contract BehaviorGraphToken is ERC721, ERC721URIStorage, Ownable, SocketsIndexedByName {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  mapping(uint256 => BehaviorGraph) private _behaviorGraphs;

  event SafeMint(uint256 tokenId, address toNode, string uri, NodeDefinitionAndValues[] nodes);

  constructor() ERC721('MyToken', 'MTK') {}

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://';
  }

  // The following functions are overrides required by Solidity.
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
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
    BehaviorGraph _behaviorGraph = new BehaviorGraph(tokenId, _nodes, _edges, _socketIndecesByNodeType);
    _behaviorGraphs[tokenId] = _behaviorGraph;

    emit SafeMint(tokenId, to, sceneUri, _nodes);

    return tokenId;
  }

  event IntVariableUpdated(address executor, uint256 _tokenId, uint8 _variableId, int256 value);
  event BoolVariableUpdated(address executor, uint256 _tokenId, uint8 _variableId, bool value);

  function invoke(uint256 tokenId, uint8 invocationName) public {
    BehaviorGraph behaviorGraph = _behaviorGraphs[tokenId];
    GraphUpdate[] memory graphUpdates = behaviorGraph.invoke(invocationName);

    for (uint16 i = 0; i < graphUpdates.length; i++) {
      GraphUpdate memory update = graphUpdates[i];
      if (update.updateType == UpdateType.IntVariableUpdated) {
        emit IntVariableUpdated(msg.sender, tokenId, update.variableId, update.intValue);
      } else if (update.updateType == UpdateType.BoolVariableUpdated) {
        emit BoolVariableUpdated(msg.sender, tokenId, update.variableId, update.boolValue);
      }
    }
  }
}
