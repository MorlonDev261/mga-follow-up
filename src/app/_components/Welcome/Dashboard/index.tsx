"use client";

import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import Counter from "@components/Counter";
import Balance from "@components/Balance";
import Insertion from "@components/Welcome/Dashboard/Insertion";
import ShortcutList from "@components/ShortcutList";
import Statistique from "@components/Statistique";
import MainTable from "@components/Table/MainTable";

export default function Dashboard() {
  return (
    <>
      <div className="p-2">
      <div className="grid gap-4 md:grid-cols-2 mb-3 shadow-md rounded-md">
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
                />{" "}
                Ar
              </>
            }
          >
            <Insertion />
          </Balance>

          <div className="mb-5 max-h-[100px] max-w-[250px]">
            <Statistique position="right" />
          </div>
          </div>
        
          <ShortcutList />

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
