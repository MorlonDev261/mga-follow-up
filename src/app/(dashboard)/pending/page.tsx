import React, { Suspense } from "react";
import Pending from "@components/Table/Pending";
import Counter from "@components/Counter";
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
          balance={pending > 0 ? <><Counter end={totalPending} duration={0.8} /> Ar.</> : "No pending payement added."</>}
          balanceColor="text-yellow-500 hover:text-yellow-600"
          subtitle="25 customers have pending payments."
          subtitleSize="text-sm"
        >
          {pending > 0 &&
            <button className="flex items-center gap-1 rounded bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New unpaid purchase
            </button>
          }
        </Balance>
      </div>
      {pending > 0 ?
        <div className="pt-2 bg-[#111]">
          <Suspense>
            <Pending />
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
