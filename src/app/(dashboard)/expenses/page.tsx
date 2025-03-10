import React, { Suspense } from "react";
import Customers from "@components/Table/Customers";
import Balance from "@components/Balance";
import { FaPlus, FaUsers } from "react-icons/fa";

export default function MyComponent() {
  const expenses = 12;
  
  return (
    <>
      <div className="px-2">
        <Balance 
          title={<><FaUsers /> List of Customers</>} 
          balance={expenses > 0 ? `Total expenses : ${expenses} now.` : "No expense added."}
          balanceSize="text-md"
          balanceColor="text-red-500 hover:text-red-600"
          subtitle="The expense resets to 0 when the cash register is empty."
          subtitleSize="text-sm"
        >
          {expenses > 0 &&
            <button className="flex items-center gap-1 rounded bg-red-500 hover:bg-red-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New expense
            </button>
          }
        </Balance>
      </div>
      {expenses > 0 ?
        <div className="pt-2">
          <Suspense>
            <Customers />
          </Suspense> 
        </div>
        :
        <div className="w-full h-[65vh] flex items-center justify-center">
          <div className="-mt-5 flex items-center justify-center flex-col ">
            <p>There is nothing to see.</p>
            <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-yellow-500 hover:bg-yellow-600"><FaPlus /> Add First Expense</button>
          </div>
        </div>
      }
    </>
  );
}
