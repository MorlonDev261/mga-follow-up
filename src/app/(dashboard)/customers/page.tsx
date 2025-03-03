import React, { Suspense } from "react";
import TableStock from "@components/DataTable/TableStock";
import Balance from "@components/Balance";
import { FaPlus, FaUsers } from "react-icons/fa";

export default function MyComponent() {
  const customers = 0;
  
  return (
    <>
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
        <Suspense fallback={<div>Loading...</div>}>
          <TableStock />
        </Suspense> :
        <div className="w-full h-full flex items-center justify-center flex-col bg-[#111]">
          <p>There is no customer. please add your customer !</p>
          <button className="px-4 flex gap-1 py-2 bg-green-500 hover:bg-green-600"><FaPlus /> Add First Customer</button>
        </div>
      }
    </>
  );
}
