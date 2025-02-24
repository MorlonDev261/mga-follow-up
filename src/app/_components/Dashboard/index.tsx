import { useState } from 'react';
import { FaRegEnvelope, FaPlus, FaClipboardUser } from "react-icons/fa6";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FiBell, FiLifeBuoy, FiSearch } from 'react-icons/fi';
import { ImUserPlus } from "react-icons/im";
import { AiOutlineProduct } from "react-icons/ai";
import Image from 'next/image';
import Dropdown from "@components/Dropdown";
import DialogPopup from "@components/DialogPopup";
import UserForm from "@components/Form/UserForm";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ShortcutList from '@components/ShortcutList';
import Statistique from '@components/Statistique';
import ExcelTab from '@components/ExcelTab';

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
                <h3 className="text-gray-400 flex items-center gap-1"><MdOutlineAccountBalanceWallet /> Net Available</h3>
                <div className="my-2 flex items-center justify-between text-2xl font-bold">
                  <div className="text-green-500">
                    5,220,500 AR
                  </div>
                  <Dropdown 
                    btn={
                      <button className="flex items-center justify-center gap-1 rounded bg-blue-500 px-2 py-1 text-sm">
                        <FaPlus /> New
                      </button>
                    } 
                    title="Insersion"
                  >
                    <DropdownMenuItem> 
                      <DialogPopup label={<button className="w-full"><AiOutlineProduct /> New arrivals</button>} title="Insertion new arrivals"  desc="Fill in the details to add a new product.">
                        {(setOpen) => <UserForm type="customer" status="post" setOpen={setOpen} />}
                      </DialogPopup>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DialogPopup label={<button className="w-full"><AiOutlineProduct /> New arrivals</button>} title="Insertion new arrivals"  desc="Fill in the details to add a new product.">
                        {(setOpen) => <UserForm type="customer" status="post" setOpen={setOpen} />}
                      </DialogPopup>
                      <ImUserPlus />&nbsp;New customer
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DialogPopup label={<button className="w-full"><FaClipboardUser />&nbsp;New employer</button>} title="Insertion new arrivals"  desc="Fill in the details to add a new product.">
                        {(setOpen) => <UserForm type="customer" status="post" setOpen={setOpen} />}
                      </DialogPopup>
                    </DropdownMenuItem>
                  </Dropdown>
                </div>
                <p className="text-gray-400">= AIED4350</p>
              </div>
              <div className="mb-5 max-h-[100px] max-w-[250px]">
                <Statistique position="right" />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                <ShortcutList />
              </div>
            </div>

            <div className="bg-[#111] text-white p-2">
              <h3 className="mb-4">Statistique de vente:</h3>
              <div className="mb-5 w-full">
                <Statistique type="courbe" legende={false} />
              </div>
            </div>
          </div>
        </main>
      )}
      {activeTab === 'excel' && (
        <main className="p-1">
          <div className="bg-[#111]">
            <h3 className="text-xl px-1 mb-4">Financial Tracking</h3>
            <ExcelTab />
          </div>
        </main>
      )}
    </div>
  );
}
