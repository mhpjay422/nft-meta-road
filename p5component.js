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
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChangeFunc(e) {
    const file = e.target.parentElement.lastElementChild.toDataURL("image/png");
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <div>
      <div className="h-20 bg-gray-50"></div>
      <div className="flex align-middle justify-around bg-black border-t-2 border-b-2">
        <div id="canvascontainer" className="bg-white">
          <button
            id="saveButton"
            type="file"
            name="Asset"
            onClick={onChangeFunc}
            className="absolute h-20 w-40 bg-blue-500 left-0"
          >
            Save Image
          </button>
          <P5Wrapper sketch={sketch} />
        </div>
      </div>
    </div>
  );
}
