// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import './BehaviorGraph.sol';

contract BehaviorGraphToken is ERC721, ERC721URIStorage, Ownable {
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
    BehaviorGraph _behaviorGraph = new BehaviorGraph(_nodes, _edges);
    _behaviorGraphs[tokenId] = _behaviorGraph;

    emit SafeMint(tokenId, to, sceneUri, _nodes);

    return tokenId;
  }
}
