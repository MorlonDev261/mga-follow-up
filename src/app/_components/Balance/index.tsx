"use client";

import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaPlus, FaClipboardUser } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { ImUserPlus } from "react-icons/im";
import Counter from "@components/Counter";
import Dropdown from "@components/Dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Assure-toi d'avoir ce composant

export default function Balance() {
  return (
    <div className="mb-4">
      <h3 className="text-gray-400 flex items-center gap-1">
        <MdOutlineAccountBalanceWallet /> Net Available
      </h3>
      <div className="my-2 flex items-center justify-between text-2xl font-bold">
        <div className="text-green-500">
          <Counter end={5220500} duration={0.8} sound="on" src="/sounds/money-sound.mp3" /> Ar
        </div>
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
      </div>
      <p className="text-gray-400">
        = AED <Counter end={4350} duration={0.8} />
      </p>
    </div>
  );
}
