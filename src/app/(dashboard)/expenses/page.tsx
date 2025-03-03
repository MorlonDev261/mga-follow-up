import React, { Suspense } from "react";
import Customers from "@components/Table/Customers";
import Balance from "@components/Balance";
import { FaPlus, FaUsers } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function MyComponent() {
  const expenses = 12;
  
  return (
    <main className={cn(customers <= 0 && "bg-[#111]")}>
      <div className="px-2 bg-[#111]">
        <Balance 
          title={<><FaUsers /> List of Customers</>} 
          balance={expenses > 0 ? `Total expenses : ${expenses} now.` : "No expense added."}
          subtitle="The expense resets to 0 when the cash register is empty."
        >
          {expenses > 0 &&
            <button className="flex items-center justify-center gap-1 rounded bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New expense
            </button>
          }
        </Balance>
      </div>
      {expenses > 0 ?
        <div className="pt-2 bg-[#111]">
          <Suspense>
            <Customers />
          </Suspense> 
        </div>
        :
        <div className="w-full h-[65vh] flex items-center justify-center bg-[#111]">
          <div className="-mt-5 flex items-center justify-center flex-col ">
            <p>There is nothing to see.</p>
            <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-yellow-500 hover:bg-yellow-600"><FaPlus /> Add First Expense</button>
          </div>
        </div>
      }
    </main>
  );
}
