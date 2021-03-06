/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "./config.js";
// import NFT from "../artifacts/contracts/nft.sol/nft.json";
// import Market from "../artifacts/contracts/nftmarket.sol/nftmarket.json";
import { abi } from "./abi/abi.js";
import { marketAbi } from "./abi/marketAbi.js";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch";

export default function P5component() {
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async function mintNFT() {
    const canvasURL = document.getElementById("defaultCanvas0").toDataURL();
    const block = canvasURL.split(";");
    const contentType = block[0].split(":")[1];
    const realData = block[1].split(",")[1];
    const blob = b64toBlob(realData, contentType);
    const fileUpload = new File([blob], "image.jpeg", {
      type: blob.type,
    });
    try {
      const added = await client.add(fileUpload, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createMarket(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createMarket(fileURL) {
    const { name, description, price } = formInput;
    if (!name || !description || !price) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileURL,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftaddress, abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    contract = new ethers.Contract(nftmarketaddress, marketAbi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="h-max-full">
      <div className="flex align-middle justify-around bg-black border-t-2 border-b-2">
        <button
          id="saveButton"
          type="file"
          name="Asset"
          className="relative h-20 w-40 bg-green-500 self-center"
        >
          Save Image
        </button>
        <div className="flex flex-row">
          <form id="canvascontainer" className="bg-white">
            <P5Wrapper sketch={sketch} />
          </form>
        </div>
        <div className="w-1/4 flex flex-col pb-12 mt-16">
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Asset Price in Eth"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <button
            id="MintButton"
            type="file"
            name="Asset"
            onClick={mintNFT}
            className="mt-2 h-16 w-60 bg-blue-400"
          >
            Mint NFT
          </button>
        </div>
      </div>
    </div>
  );
}
