/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
// import Script from "next/script";
import "../styles/globals.css";
import Link from "next/link";
import { useState } from "react";

import CeramicClient from "@ceramicnetwork/http-client";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";

import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";

const endpoint = "https://ceramic-clay.3boxlabs.com";

import dynamic from "next/dynamic";

const ConnectComponentWithNoSSR = dynamic(() => import("../connect.js"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function connect() {
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return addresses;
  }

  async function readProfile() {
    const [address] = await connect();
    const ceramic = new CeramicClient(endpoint);
    const idx = new IDX({ ceramic });

    try {
      const data = await idx.get("basicProfile", `${address}@eip155:1`);

      console.log("data: ", data);
      if (data.name) setName(data.name);
      if (data.avatar) setImage(data.avatar);
    } catch (error) {
      console.log("error: ", error);
      setLoaded(true);
    }
  }

  async function updateProfile() {
    const [address] = await connect();
    const ceramic = new CeramicClient(endpoint);
    const threeIdConnect = new ThreeIdConnect();
    const provider = new EthereumAuthProvider(window.ethereum, address);

    await threeIdConnect.connect(provider);

    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: {
        ...ThreeIdResolver.getResolver(ceramic),
      },
    });

    ceramic.setDID(did);
    await ceramic.did.authenticate();

    const idx = new IDX({ ceramic });

    await idx.set("basicProfile", {
      name,
      avatar: image,
    });

    console.log("Profile updated!");
  }

  return (
    <div>
      <div className="min-height-footer">
        <nav className="flex flex-row border-b p-6 justify-between">
          <div>
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
              <Link href="/generate-art">
                <a className="mr-8 text-purple-500">Generate Art</a>
              </Link>
            </div>
          </div>
          <div className="flex flex-row mt-6">
            {name && <h3 className="mr-4 text-4xl">Hello, {name}</h3>}
            {!image && !name && loaded && (
              <h4>No profile, please create one...</h4>
            )}
            {image && <img className="w-20 h-14" src={image} />}
          </div>
          <div className="flex flex-col">
            <div className="self-end">
              <input
                className="border-2 border-gray-400 rounded-sm"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border-2 border-gray-400 rounded-sm ml-1 mr-1"
                placeholder="Profile Image Url"
                onChange={(e) => setImage(e.target.value)}
              />
              <button
                onClick={readProfile}
                className="bg-blue-400 text-white border-2 border-blue-400 ml-1 mr-1 shadow-xl rounded-lg"
              >
                <p className="m-1 ml-2 mr-2">Read Profile</p>
              </button>
              <button
                onClick={updateProfile}
                className="bg-blue-400 text-white border-2 border-blue-400 ml-1 mr-1 shadow-xl rounded-lg"
              >
                <p className="m-1 ml-2 mr-2">Set Profile</p>
              </button>
            </div>
            <ConnectComponentWithNoSSR />
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
      <footer className="h-28 border-t-2 solid mt-10 ">
        <div className="ml-40 mr-40 justify-between flex flex-row pt-7">
          <div className="font-sans text-gray-800 align-middle flex self-center">
            ?? 2021 Metaroad Marketplace, Inc. All rights reserved
          </div>
          <div className="flex align-middle text-blue-700 no-underline">
            <Link
              href="https://www.linkedin.com/in/jason-gong-79772b126/"
              passHref
            >
              <img
                className="h-10 w-10 self-center flex cursor-pointer mr-20"
                src="linked.png"
              ></img>
            </Link>
            <Link href="https://github.com/mhpjay422" passHref>
              <img
                className="h-10 w-10 self-center flex cursor-pointer"
                src="github2.png"
              ></img>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
