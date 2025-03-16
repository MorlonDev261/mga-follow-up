"use client";

import * as React from "react";
import { FaPlus } from "react-icons/fa6";
import { BsShopWindow } from "react-icons/bs";
import Balance from "@components/Balance";
import Counter from "@components/Counter";
import StockList from "./StockList";
import Statistique from "@components/Statistique";
import TableStock from "@components/Table/Stock";
import { Suspense } from "react";

export default function Stock() {
  const stocks = [
    { id: 'hzhe58', name: '24-03-25', value: 457900, sales: 3636 },
    { id: 'jrfhz8', name: '01-02-25', value: 457900, sales: 846 },
    { id: 'hzshr8', name: '24-01-25', value: 457900, sales: 5353 },
    { id: 'ryhey6', name: '07-02-25', value: 7, sales: 35 },
    { id: 'hry488', name: '10-02-25', value: 53, sales: 386 },
    { id: 'hjfe58', name: '14-02-25', value: 7, sales: 5263 },
    { id: 'hzjrj8', name: '06-03-25', value: 568, sales: 56 },
    { id: 'hkrjra', name: '08-03-25', value: 567, sales: 56 },
  ];

  return (
    <main>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Balance Component */}
        <div className="p-2">
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
          <div className="text-white p-2">
            <h3 className="mb-4">Statistique de vente:</h3>
            <div className="w-full">
              <Statistique type="bar" legende={false} />
            </div>
          </div>
        </div>
      </div>

      <Suspense>
        <StockList stocks={stocks} />
      </Suspense>
      
      {/* Data Table */}
      <Suspense>
        <TableStock />
      </Suspense>
    </main>
  );
}
