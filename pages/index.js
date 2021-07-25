import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../config.js";

export default function Home() {
  return (
    <div className="border-b grid justify-items-center">
      <div className="p-10 self-center	">Home</div>
    </div>
  );
}
