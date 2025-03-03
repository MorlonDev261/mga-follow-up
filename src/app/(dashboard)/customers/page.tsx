import React, { Suspense } from "react";
import TableStock from "@components/DataTable/TableStock";
import Balance from "@components/Balance";
import { FaPlus, FaUsers } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function MyComponent() {
  const customers = 12;
  
  return (
    <div className={cn(customers <= 0 && "bg-[#111]")}>
      <div className="px-2 bg-[#111]">
        <Balance 
          title={<><FaUsers /> List of Customers</>} 
          subtitle={customers > 0 ? "26 customers now." : "No customer registered."}
          subtitleSize="text-xl"
          subtitleColor="text-green-500"
        >
          {customers > 0 &&
            <button className="flex items-center justify-center gap-1 rounded bg-blue-500 hover:bg-blue-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New customer
            </button>
          }
        </Balance>
      </div>
      {customers > 0 ?
        <div className="w-full h-[100%] mt-2 flex items-center justify-center flex-col bg-[#111]">
          <Suspense fallback={<div>Loading...</div>}>
            <TableStock />
          </Suspense> 
        </div>
        :
        <div className="w-full h-[65vh] flex items-center justify-center bg-[#111]">
          <div className="-mt-5 flex items-center justify-center flex-col ">
            <p>There is no customer. please add your customer !</p>
            <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-green-500 hover:bg-green-600"><FaPlus /> Add First Customer</button>
          </div>
        </div>
      }
    </div>
  );
}
