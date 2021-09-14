import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const RINKEBY_NETWORK_ID = 4;
let _provider = null;
let _signer = null;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "b10ee952e53944bda93d5ec291b03594", // required
    },
  },
};

const web3Modal = new Web3Modal({
  network: "rinkeby", // optional
  providerOptions, // required
  theme: "dark",
});

export default function Connect() {
  const [userWallet, setUserWallet] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setNetworkError(
      !(
        window.ethereum.chainId == "0x4" &&
        window.ethereum.selectedAddress != null
      )
    );
  }, []);

  const fetchAccountData = async () => {
    const _web3 = new ethers.providers.Web3Provider(_provider);
    _signer = _web3.getSigner();

    const accounts = await _web3.listAccounts();
    const { chainId } = await _web3.getNetwork();

    console.log(chainId);

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
    const selectedAccount = accounts[0];

    setUserWallet(selectedAccount);
    _checkNetwork(chainId);
  };

  const _checkNetwork = (chainId) => {
    if (
      chainId === RINKEBY_NETWORK_ID &&
      window.ethereum.selectedAddress != null
    ) {
      setNetworkError(false);
      return true;
    }
    setNetworkError(true);
    return false;
  };

  const connectWallet = async () => {
    web3Modal.clearCachedProvider();

    console.log("Opening a dialog", web3Modal);
    try {
      _provider = await web3Modal.connect();
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    // Subscribe to accounts change
    _provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });

    // Subscribe to chainId change
    _provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });

    // Subscribe to networkId change
    _provider.on("networkChanged", (networkId) => {
      fetchAccountData();
    });

    await fetchAccountData();
  };

  return (
    <div className="flex justify-between">
      {networkError && (
        <p className="self-center text-red-500 font-black text-xl mr-4 mt-4">
          Please connect wallet to the Rinkeby Testnet
        </p>
      )}
      <button
        className="h-16 w-52 self-end border-2 border-grey-600 solid ml-auto mt-4 bg-green-600 text-white shadow-xl rounded-xl"
        onClick={connectWallet}
      >
        Connect Wallet
      </button>
    </div>
  );
}
