import { useState } from 'react';
import { FaRegEnvelope } from "react-icons/fa6";
import { FiBell, FiLifeBuoy, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import ShortcutList from '@components/ShortcutList';
import Statistique from '@components/Statistique';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'excel'>('dashboard');

  return (
    <div className="min-h-screen bg-[#010101] text-white">
      <header className="sticky top-0 z-50 w-full bg-[#111] p-2">
        <div className="flex items-center justify-between gap-4">
          <Image
            src="/profile.jpg"
            width={30}
            height={30}
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
            <FaRegEnvelope className="text-xl" />
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
              <div className="bg-[#ccc] maw-h-[200px] max-w-[230px]">
                <Statistique />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                <ShortcutList />
              </div>
            </div>

            <div className="bg-[#111] p-2">
              <h3 className="mb-4">Statistique</h3>
              <div className="mb-5">
                <Statistique />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
