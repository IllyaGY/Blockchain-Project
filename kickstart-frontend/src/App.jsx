import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { listCampaigns, createCampaign, donate, promote } from './api';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalEth, setGoalEth] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    listCampaigns().then(setCampaigns);
  }, [refresh]);

  const handleCreate = async () => {
    if (!title || !description || !goalEth) return;
    await createCampaign({ title, description, goalEth });
    setTitle('');
    setDescription('');
    setGoalEth('');
    setRefresh(r => r + 1);
  };

  const handleDonate = async (id, amount) => {
    if (!amount) return;
    await donate(id, amount);
    setRefresh(r => r + 1);
  };

  const handlePromote = async id => {
    await promote(id);
    setRefresh(r => r + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kickstart DApp</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(c => {
          const goal = ethers.utils.formatEther(c.goal);
          const funds = ethers.utils.formatEther(c.funds);
          const progress = goal > 0 ? ((funds / goal) * 100).toFixed(1) : '0';
          return (
            <div key={c.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold mb-1">{c.title}</h3>
              <p className="mb-2">{c.description}</p>
              <p>Goal: {goal} ETH</p>
              <p>Funds: {funds} ETH</p>
              <p>Promotions: {c.promotions}</p>
              <p>Progress: {progress}%</p>
              <div className="mt-2">
                <input
                  id={`donate-${c.id}`} 
                  className="border p-1 w-1/2"
                  placeholder="ETH"
                />
                <button
                  className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    const amt = document.getElementById(`donate-${c.id}`).value;
                    handleDonate(c.id, amt);
                  }}
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
          );
        })}
      </div>
    </div>
  );
}

export default App;
