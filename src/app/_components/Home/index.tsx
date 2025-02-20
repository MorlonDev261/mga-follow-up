import { useState } from 'react';
import { FiUser, FiBell, FiLifeBuoy, FiSearch, FiDollarSign } from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Image from 'next/image';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'excel'>('dashboard');

  const chartData = {
    labels: ['Revenu', 'Dépense', 'Pending'],
    datasets: [
      {
        label: 'Statistiques',
        data: [65, 25, 10],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderWidth: 0,
      },
    ],
  };

  const shortcuts = [
    { label: 'Revenu', icon: <FiDollarSign /> },
    { label: 'Depense', icon: <FiDollarSign /> },
    { label: 'Pending', icon: <FiDollarSign /> },
    { label: 'Agenda', icon: <FiDollarSign /> },
    { label: 'Stock', icon: <FiDollarSign /> },
    { label: 'Client', icon: <FiDollarSign /> },
    { label: 'Profile', icon: <FiDollarSign /> },
    { label: 'Paramètre', icon: <FiDollarSign /> },
  ];

  return (
    <div className="min-h-screen bg-[#010101] text-white">
      <header className="sticky top-0 z-50 w-full bg-[#111] p-2">
        <div className="flex items-center justify-between gap-4">
          <Image
            src="/profile.jpg"
            width={25}
            height={25}
            alt="profile"
            className="rounded-full border border-white"
          />
          
          <div className="flex w-full max-w-[250px] items-center rounded bg-white/10 p-1">
            <button
              className={`w-1/2 rounded p-1 ${activeTab === 'dashboard' ? 'bg-white/40' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`w-1/2 rounded p-1 ${activeTab === 'excel' ? 'bg-white/40' : ''}`}
              onClick={() => setActiveTab('excel')}
            >
              Excel
            </button>
          </div>

          <div className="flex items-center gap-4">
            <FiUser className="text-xl" />
            <FiBell className="text-xl" />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Recherche..."
              className="w-full rounded-full bg-[#222] py-1 pl-10 pr-4 outline-none"
            />
          </div>
          <FiLifeBuoy className="text-xl" />
        </div>
      </header>

      {activeTab === 'dashboard' && (
        <main className="p-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#111] p-2">
              <div className="mb-4">
                <h3 className="text-gray-400">Net Available 👁️‍🗨️</h3>
                <div className="my-2 flex items-center justify-between text-2xl font-bold">
                  <div>
                    220,533.65 <span className="text-xs text-gray-400">NGN ⬇️</span>
                  </div>
                  <button className="rounded bg-blue-500 px-3 py-1 text-sm">Deposit</button>
                </div>
                <p className="text-gray-400">= 0.00151512 BTC</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex h-20 flex-col items-center justify-center rounded bg-[#222] p-2"
                  >
                    <span className="mb-1 text-xl">{shortcut.icon}</span>
                    <span className="text-xs">{shortcut.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] p-2">
              <h3 className="mb-4">Statistique</h3>
              <div className="mx-auto max-w-[200px]">
                <Doughnut data={chartData} />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
