import React, { Suspense } from "react";
import TableStock from "@components/DataTable/TableStock";
import { FaPlus } from "react-icons/fa";

export default function MyComponent() {
  const pending = true;
  
  return (
    <>
      <div className="px-2 bg-[#111]">
        <h2 className="text-lg">List of Customers</h2>
        {customers &&
          <h3 className="text-blue-500">250 Customers now.</h3>
        }
      </div>
      {customers ?
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
