"use client";

import { useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { FaRegEnvelope, FaPlus, FaClipboardUser } from "react-icons/fa6";
import { FiBell, FiSearch } from 'react-icons/fi';
import { AiOutlineProduct } from "react-icons/ai";
import { LuScanLine } from "react-icons/lu";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { ImUserPlus } from "react-icons/im";
import Counter from "@components/Counter";
import Dropdown from "@components/Dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Balance from "@components/Balance";
import ShortcutList from '@components/ShortcutList';
import Statistique from '@components/Statistique';
import DataTableMain from "@components/DataTable/DataTableMain";
import ExcelTab from '@components/ExcelTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'excel'>('dashboard');

  return (
     <>
      {activeTab === 'dashboard' && (
        <main className="p-2">
          <div className="grid gap-4 md:grid-cols-2">
            
            <div className="bg-[#111] p-2">
              
              <Balance 
                title={<><MdOutlineAccountBalanceWallet /> Net Available</>} 
                subtitle={<>= AED <Counter end={4350} duration={0.8} /></>}
                balance={<><Counter end={5220500} duration={0.8} sound="on" src="/sounds/money-sound.mp3" /> Ar</>}
              >
                <Dropdown
                  btn={
                    <button className="flex items-center justify-center gap-1 rounded bg-blue-500 px-2 py-1 text-sm text-white">
                      <FaPlus /> New
                    </button>
                  }
                  title="Insertion"
                >
                  <DropdownMenuItem>
                    <AiOutlineProduct /> New arrivals
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ImUserPlus /> New customer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FaClipboardUser /> New employer
                  </DropdownMenuItem>
                </Dropdown>
              </Balance>
              
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

          <DataTableMain />
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
    </>
  );
}
