import "../styles/globals.css";
import Link from "next/link";
import { useState } from "react";

import CeramicClient from "@ceramicnetwork/http-client";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";

import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";

const endpoint = "https://ceramic-clay.3boxlabs.com";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Metaroad Marketplace</p>
        <div className="flex mt-8">
          <Link href="/">
            <a className="mr-8 text-purple-500">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-8 text-purple-500">Sell NFT</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-8 text-purple-500">My NFTs</a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-8 text-purple-500">Creator Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
