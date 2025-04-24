import { ethers } from 'ethers';
import KickstartAbi from '../contract/Kickstart.json';

// Prompt MetaMask to connect
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, KickstartAbi, signer);

export const listCampaigns = async () => {
  const count = await contract.getCampaignCount();
  const campaigns = [];
  for (let i = 1; i <= count.toNumber(); i++) {
    const [title, description, goal, funds, owner, promotions, donors] = await contract.getCampaign(i);
    campaigns.push({
      id: i,
      title,
      description,
      goal: goal.toString(),
      funds: funds.toString(),
      owner,
      promotions: promotions.toNumber(),
      donors
    });
  }
  return campaigns;
};

export const createCampaign = async ({ title, description, goalEth }) => {
  const goalWei = ethers.utils.parseEther(goalEth);
  const tx = await contract.createCampaign(title, description, goalWei);
  return tx.wait();
};

export const donate = async (id, amountEth) => {
  const value = ethers.utils.parseEther(amountEth);
  const tx = await contract.donate(id, { value });
  return tx.wait();
};

export const promote = async id => {
  const tx = await contract.promote(id);
  return tx.wait();
};