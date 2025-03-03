"use client";

import React, { Suspense } from "react";
import { BsShopWindow } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import Balance from "@components/Balance";
import Counter from "@components/Counter";
import Statistique from "@components/Statistique";
import TableStock from "@components/DataTable/TableStock";

export default function Stock() {
  return (
    <main className="p-2">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Balance Component */}
        <div className="bg-[#111] p-2">
          <Balance 
            title={<><BsShopWindow key="icon" /> Stock Available</>} 
            subtitle={<>Total Sales: <Counter end={4350} duration={0.8} />pcs</>}
            balance={<><Counter end={5220500} duration={0.8} sound="on" src="/sounds/money-sound.mp3" /> Pcs</>}
            balanceColor="text-blue-500"
          >
            <button 
              type="button" 
              className="flex items-center justify-center gap-1 rounded bg-blue-500 px-2 py-1 text-sm text-white"
            >
              <FaPlus /> New arrival
            </button>
          </Balance>

          {/* Statistique Component */}
          <div className="bg-[#111] text-white p-2">
            <h3 className="mb-4">Statistique de vente:</h3>
            <div className="mb-5 w-full">
              <Statistique type="courbe" legende={false} />
            </div>
          </div>
        </div>
      </div>
      {/* Data Table */}
      <Suspense>
        <TableStock />
      </Suspense>
    </main>
  );
}
