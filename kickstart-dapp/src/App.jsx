// src/App.jsx
import React, { useState, useEffect } from 'react';
import { getContract } from './useContract';
import { ethers } from 'ethers';

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalEth, setGoalEth] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState('');

  // Load campaigns
  useEffect(() => {
    (async () => {
      try {
        const contract = await getContract();
        if (!contract) throw new Error('Contract not loaded');
        const countBn = await contract.getCampaignCount();
        const list = [];
        for (let i = 1; i <= countBn.toNumber(); i++) {
          const [t, d, g, f, owner, promos, donors] = await contract.getCampaign(i);
          list.push({
            id: i,
            title: t,
            description: d,
            goal: ethers.utils.formatEther(g),
            funds: ethers.utils.formatEther(f),
            owner,
            promotions: promos.toNumber(),
            donors
          });
        }
        setCampaigns(list);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    })();
  }, [refresh]);

  // Handlers
  const handleCreate = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.createCampaign(
        title,
        description,
        ethers.utils.parseEther(goalEth)
      );
      await tx.wait();
      setTitle(''); setDescription(''); setGoalEth('');
      setRefresh(r => r + 1);
    } catch (e) {
      console.error(e);
      alert('Error creating: ' + e.message);
    }
  };

  const handleDonate = async (id) => {
    const amt = document.getElementById(`donate-${id}`).value;
    if (!amt) return alert('Enter ETH amount');
    try {
      const contract = await getContract();
      const tx = await contract.donate(id, { value: ethers.utils.parseEther(amt) });
      await tx.wait();
      setRefresh(r => r + 1);
    } catch (e) {
      console.error(e);
      alert('Error donating: ' + e.message);
    }
  };

  const handlePromote = async (id) => {
    try {
      const contract = await getContract();
      const tx = await contract.promote(id);
      await tx.wait();
      setRefresh(r => r + 1);
    } catch (e) {
      console.error(e);
      alert('Error promoting: ' + e.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kickstart DApp</h1>
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {/* Create Campaign */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl mb-2">Create Campaign</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Goal (ETH)"
          value={goalEth}
          onChange={e => setGoalEth(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>

      {/* Running Campaigns */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl mb-2">Running Campaigns</h2>
        {campaigns.length === 0
          ? <p className="text-gray-600">No campaigns yet.</p>
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map(c => (
                <div key={c.id} className="border p-4 rounded shadow">
                  <h3 className="font-semibold mb-1">{c.title}</h3>
                  <p className="mb-2">{c.description}</p>
                  <p>Goal: {c.goal} ETH</p>
                  <p>Funds: {c.funds} ETH</p>
                  <p>Progress: {((+c.funds / +c.goal) * 100).toFixed(1)}%</p>
                  <div className="mt-2 flex items-center">
                    <input
                      id={`donate-${c.id}`}
                      className="border p-1 w-1/2"
                      placeholder="ETH"
                    />
                    <button
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDonate(c.id)}
                    >
                      Donate
                    </button>
                    <button
                      className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handlePromote(c.id)}
                    >
                      Promote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
