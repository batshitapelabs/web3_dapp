// import { ETHERSCAN_API_KEY } from "./secrets/api_keys.js";
// import { ethers } from "ethers";
//
// const ERC721_TX_ACTION = "tokennfttx";
// const ERC1155_TX_ACTION = "token1155tx";
//
// const ERC721_CONTRACT_ABI = [
//   "function tokenURI(uint256 _tokenId) external view returns (string memory)",
// ];
// const ERC1155_CONTRACT_ABI = [
//   "function uri(uint256 _id) external view returns (string memory)",
// ];
//
// const fetchNFTsFromEtherscan = async (address) => {
//   console.log("fetching ERC721TokensMetadata");
//   await fetchERC721TokensMetadata(address);
//   console.log("fetching fetchERC1155TokensMetadata");
//   await fetchERC1155TokensMetadata(address);
//   console.dir(metadataArray);
//
//   // let modifiedMetadata = await fetchNormalizedMetadata()
//   let metadata = await fetchNormalizedMetadata();
//   console.dir(metadata);
//   // filter out invalid contentTypes
//   let validContentTypes = [
//     "image/png",
//     "image/gif",
//     "image/svg+xml",
//     "image/jpeg",
//     "video/mp4",
//   ];
//
//   console.log("filtering out invalid contentTypes");
//   let filterdMetadata = metadata.filter((data) => {
//     // console.log(`data.contentType - ${data.contentType}`)
//     return validContentTypes.includes(data.contentType);
//   });
//   console.dir(filterdMetadata);
//
//   console.log("sorting metadata");
//   filterdMetadata.sort(function (a, b) {
//     return a.contractAddress.localeCompare(b.contractAddress);
//   });
//   console.dir(filterdMetadata);
//
//   setLoading(false);
//   setMetadata(filterdMetadata);
// };
//
// // This doesn't factor in anything you minted
// const fetchEtherscanTransactions = async (address, action) => {
//   let url = `https://api.etherscan.io/api?module=account&action=${action}&address=${address}&page=1&offset=600&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
//   const txns = fetch(url)
//     .then((response) => response.json())
//     .then((response) => {
//       return response.result;
//     })
//     .catch((err) => {
//       console.error(`fetchEtherscanTransactions - ${err}`);
//       setLoading(false);
//     });
//   return txns;
// };
//
// const getOwnedNFTs = async (address, txAction) => {
//   let owned = [];
//   let transactions = await fetchEtherscanTransactions(address, txAction);
//   if (transactions == null) return [];
//
//   console.log(`transactions.length - ${transactions.length}`);
//
//   // filter out airdrop spam NFTs
//   // transactions = transactions.filter((tx) => {return tx.from != "0x0000000000000000000000000000000000000000"})
//   let buys = transactions.filter((tx) => {
//     return tx.to === address;
//   });
//   let sells = transactions.filter((tx) => {
//     return tx.from === address;
//   });
//   console.dir(transactions);
//   console.log(`txAction - ${txAction}`);
//   console.log(`buys.length - ${buys.length}`);
//   console.log(`sells.length - ${sells.length}`);
//
//   buys.forEach(function (buy) {
//     if (
//       sells.some(
//         (sell) =>
//           sell.tokenID === buy.tokenID &&
//           sell.contractAddress === buy.contractAddress
//       )
//     ) {
//       // You no longer own these NFTs
//     } else {
//       let obj = {
//         tokenID: `${buy.tokenID}`,
//         tokenName: `${buy.tokenName}`,
//         contractAddress: `${buy.contractAddress}`,
//       };
//       // console.log(`Pushing obj onto array`)
//       // console.dir(obj)
//       owned.push(obj);
//     }
//   });
//
//   console.log(`owned.length - ${owned.length}`);
//
//   return owned;
// };
//
// const getContract = (abi, address) => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const signer = provider.getSigner();
//   return new ethers.Contract(address, abi, signer);
// };
//
// const getURI = async (abi, address, tokenId) => {
//   try {
//     const contract = getContract(abi, address);
//     const result = await contract.uri(tokenId);
//     return result;
//   } catch (error) {
//     console.error(`getURI() address - ${address} - ${error}`);
//     throw error;
//   }
// };
// const updateURI = (uri) => {
//   let updatedURI = uri;
//   if (updatedURI.startsWith("ipfs://")) {
//     updatedURI = `https://ipfs.io/ipfs/${updatedURI.split("ipfs://")[1]}`;
//   }
//   // updatedURI = `https://cors-anywhere.herokuapp.com/${updatedURI}`
//   return updatedURI;
// };
//
// const getTokenURI = async (abi, address, tokenId) => {
//   try {
//     const contract = getContract(abi, address);
//     const result = await contract.tokenURI(tokenId);
//     return result;
//   } catch (error) {
//     console.error(`getTokenURI() address - ${address} - ${error}`);
//     throw error;
//   }
// };
//
// const fetchERC721TokensMetadata = async (address) => {
//   let ownedNFTs = await getOwnedNFTs(address, ERC721_TX_ACTION);
//
//   /*eslint no-loop-func: "error"*/
//   /*eslint-env es6*/
//   // eslint-disable-line no-loop-func
//   for (var i = 0; i < ownedNFTs.length; i++) {
//     const nft = ownedNFTs[i];
//
//     try {
//       // let abi = await fetchABI(nft.contractAddress);
//       let tokenURI = await getTokenURI(
//         ERC721_CONTRACT_ABI,
//         nft.contractAddress,
//         nft.tokenID
//       );
//       let updatedURI = updateURI(tokenURI);
//       let object = await fetch(updatedURI)
//         .then((response) => response.json())
//         .then((response) => {
//           let obj = {
//             name: `${response.name}`,
//             tokenName: `${nft.tokenName}`,
//             tokenID: `${nft.tokenID}`,
//             image: `${response.image}`,
//             contractAddress: `${nft.contractAddress}`,
//           };
//           // metadataArray.push(obj)
//           return obj;
//         })
//         .catch((error) => {
//           console.error(
//             `fetchERC721TokensMetadata() | updatedURI - ${updatedURI} error - ${error}`
//           );
//         });
//       if(object !== undefined){
//           console.dir(object);
//           metadataArray.push(object);
//       }
//     } catch (error) {
//       console.error(`fetchERC721TokensMetadata() | error - ${error}`);
//     }
//   }
// };
//
// const fetchERC1155TokensMetadata = async (address) => {
//   let ownedNFTs = await getOwnedNFTs(address, ERC1155_TX_ACTION);
//
//   /*eslint no-loop-func: "error"*/
//   /*eslint-env es6*/
//   // eslint-disable-line no-loop-func
//   for (var i = 0; i < ownedNFTs.length; i++) {
//     const nft = ownedNFTs[i];
//
//     try {
//       // let abi = await fetchABI(nft.contractAddress);
//       let uri = await getURI(
//         ERC1155_CONTRACT_ABI,
//         nft.contractAddress,
//         nft.tokenID
//       );
//       let updatedURI = updateURI(uri);
//
//       let object = await fetch(updatedURI)
//         .then((response) => response.json())
//         .then((response) => {
//           let obj = {
//             name: `${response.name}`,
//             tokenName: `${nft.tokenName}`,
//             tokenID: `${nft.tokenID}`,
//             image: `${response.image}`,
//             contractAddress: `${nft.contractAddress}`,
//           };
//           return obj;
//         })
//         .catch((error) => console.error(error));
//       if(object !== undefined){
//           console.dir(object);
//           metadataArray.push(object);
//       }
//     } catch (error) {
//       console.error(`fetchERC1155TokensMetadata() | updatedURI - ${error}`);
//     }
//   }
// };
//
// const fetchABI = (address) => {
//   try {
//     let url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`
//     const abi = fetch(url)
//       .then((response) => response.json())
//       .then((response) => { return response.result;})
//       .catch(err => console.error(err));
//     return abi;
//   } catch(error) {
//     throw error;
//   }
// }
