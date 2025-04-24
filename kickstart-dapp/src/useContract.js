// src/useContract.js
import { ethers } from 'ethers';
import KickstartArtifact from './contract/Kickstart.json';

let contract;

async function getProvider() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    return provider;
  }
  throw new Error(
    'No Ethereum provider found. Install MetaMask or use a browser with an injected web3 provider.'
  );
}

export async function getContract() {
  if (!contract) {
    const provider = await getProvider();
    const signer   = provider.getSigner();
    const { networks, abi } = KickstartArtifact;
    // Grab the network ID your MetaMask/provider is connected to
    const network   = await provider.getNetwork();
    const netId     = network.chainId.toString();
    const address   = networks[netId]?.address;

    if (!address) {
      throw new Error(
        `Contract not deployed on network ${netId}. ` +
        `Check that Truffle migrated to the same chain your wallet is on.`
      );
    }

    contract = new ethers.Contract(address, abi, signer);
  }
  return contract;
}

