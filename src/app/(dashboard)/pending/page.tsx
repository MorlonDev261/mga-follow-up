import React, { Suspense } from "react";
import Customers from "@components/Table/Customers";
import Balance from "@components/Balance";
import { FaPlus } from "react-icons/fa";
import { FiClock } from 'react-icons/fi';
import { cn } from "@/lib/utils";

export default function MyComponent() {
  const pending = 12;
  const totalPending = 4500000;
  
  return (
    <main className={cn(pending <= 0 && "bg-[#111]")}>
      <div className="px-2 bg-[#111]">
        <Balance 
          title={<><FiClock /> Pending Payement</>} 
          balance={pending > 0 ? `${totalPending} Ar.` : "No pending payement added."}
          balanceSize="text-md"
          balanceColor="text-yellow-500 hover:text-yellow-600"
          subtitle="25 customers have pending payments."
          subtitleSize="text-sm"
        >
          {pending > 0 &&
            <button className="flex items-center gap-1 rounded bg-red-500 hover:bg-red-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New expense
            </button>
          }
        </Balance>
      </div>
      {pending > 0 ?
        <div className="pt-2 bg-[#111]">
          <Suspense>
            <Customers />
          </Suspense> 
        </div>
        :
        <div className="w-full h-[65vh] flex items-center justify-center bg-[#111]">
          <div className="-mt-5 flex items-center justify-center flex-col ">
            <p>There is nothing to see. Please record a first sale that has not been paid yet.</p>
            <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-yellow-500 hover:bg-yellow-600"><FaPlus /> Add First Pending Payement</button>
          </div>
        </div>
      }
    </main>
  );
}
