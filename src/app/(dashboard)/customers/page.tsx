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
          subtitle=""
          balance={customers > 0 ? "26 customers now." : "No customer registered."}
        >
          <button className="flex items-center justify-center gap-1 rounded bg-blue-500 px-2 py-1 text-sm text-white">
            <FaPlus /> New customer
          </button>
        </Balance>
      </div>
      {customers > 0 ?
        <Suspense fallback={<div>Loading...</div>}>
          <TableStock />
        </Suspense> :
        <div className="w-full h-full flex items-center justify-center flex-col">
          <p>There is no customer. please add your customer !</p>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600"><FaPlus /> Add First Customer</button>
        </div>
      }
    </>
  );
}
