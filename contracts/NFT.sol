// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

//+-@openzeppelin/Counters:_ Is a really Useful Utility for Incrementing Numbers to save work that otherwise you should code by Yourself:_
import "@openzeppelin/contracts/utils/Counters.sol";
/**+-ERC-721 URI STORAGE gives us an additional Function called " _setTokenURI(uint256 tokenId, string memory _tokenURI)" that allows us to Set the N.F.Token
Uniform Resource Identifier(U.R.I.):_*/
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    //+-We enable the S.Contract to use the Struct "Counter" of the Counters Utils S.Contract:_
    using Counters for Counters.Counter;
    //+-Token IDs are going to allow us to keep up with incrementing value for an Unique Identifier for Each N.F.Token:_
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse", "METT") {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        //+-We Increment the N.F.Token ID +1 than the last ID:_
        _tokenIds.increment();
        //+-We set this new ID to the New N.F.Token that we are going to Mint:_
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        //+-We Link the Art/File/etc ID to the new New N.F.Token ID:_
        _setTokenURI(newItemId, tokenURI);

        //+-We Give the MarketPlace the Approval to tranfer this N.F.T. between Users and inside another Contract:_
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}