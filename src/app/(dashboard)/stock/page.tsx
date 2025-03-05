"use client";

import * as React from "react";
import { FaPlus } from "react-icons/fa6";
import { BsShopWindow } from "react-icons/bs";
import Balance from "@components/Balance";
import Counter from "@components/Counter";
import Statistique from "@components/Statistique";
import TableStock from "@components/DataTable/TableStock";
import { Suspense } from "react";

export default function Stock() {
  return (
    <main className="p-2">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Balance Component */}
        <div className="bg-[#111] p-2">
          <Balance
            title={
              <>
                <BsShopWindow key="icon" /> Stock Available
              </>
            }
            subtitle={<>Distributed across 6 stocks</>}
            balance={
              <>
                <Counter
                  end={5220500}
                  duration={0.8}
                  sound="on"
                  src="/sounds/money-sound.mp3"
                />{" "}
                Pcs
              </>
            }
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
              <Statistique type="bar" legende={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Suspense fallback={<div>Loading...</div>}>
        <TableStock Columns={Columns} data={data} loading={loading} />
      </Suspense>
    </main>
  );
}
