"use client";

import * as React from "react";
import { FaPlus } from "react-icons/fa6";
import { BsShopWindow } from "react-icons/bs";
import Balance from "@components/Balance";
import Counter from "@components/Counter";
import StockList from "@components/StockList";
import Statistique from "@components/Statistique";
import TableStock from "@components/Table/Stock";
import { Suspense } from "react";

export default function Stock() {
  const [loading, setLoading] = React.useState(true);

  setTimeout(() => setLoading(false), 2000);

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

      <div className="p-2">
        <StockList loading={loading} />
      </div>
      
      {/* Data Table */}
      <Suspense>
        <TableStock />
      </Suspense>
    </main>
  );
}
