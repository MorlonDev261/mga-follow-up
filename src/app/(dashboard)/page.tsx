"use client";

import { FaPlus, FaClipboardUser } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { ImUserPlus } from "react-icons/im";
import Counter from "@components/Counter";
import Dropdown from "@components/Dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Balance from "@components/Balance";
import ShortcutList from "@components/ShortcutList";
import Statistique from "@components/Statistique";
import MainTable from "@components/Table/MainTable";

export default function Dashboard() {
  return (
    <>
      <div className="p-2">
      <div className="grid gap-4 md:grid-cols-2 shadow-md">
        {/* Bloc gauche */}
          <Balance
            title={
              <>
                <MdOutlineAccountBalanceWallet /> Net Available
              </>
            }
            subtitle={
              <>
                = AED <Counter end={4350} duration={0.8} />
              </>
            }
            balance={
              <>
                <Counter
                  end={5220500}
                  duration={0.8}
                  sound="on"
                  src="/sounds/money-sound.mp3"
                />{" "}
                Ar
              </>
            }
          >
            <Dropdown
              btn={
                <button className="flex items-center justify-center gap-1 rounded bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-2 py-1 text-sm text-white">
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
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ShortcutList />
          </div>

        {/* Bloc droit */}
        <div className="text-gray-900 dark:text-white p-2">
          <h3 className="mb-4 font-semibold">Statistique de vente :</h3>
          <div className="mb-5 w-full">
            <Statistique type="courbe" legende={false} />
          </div>
        </div>
      </div>

      <MainTable />
    </>
  );
}
