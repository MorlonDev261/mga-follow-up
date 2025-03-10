import React, { Suspense } from "react";
import Customers from "@components/Table/Customers";
import Balance from "@components/Balance";
import { FaPlus, FaUsers } from "react-icons/fa";

export default function MyComponent() {
  const customers = 12;

  return (
    <>
      <div className="px-2">
        <Balance
          title={
            <>
              <FaUsers /> List of Customers
            </>
          }
          balance={
            customers > 0
              ? `You have ${customers} customers now.`
              : "No customer registered."
          }
        >
          {customers > 0 && (
            <button className="flex items-center justify-center gap-1 rounded bg-blue-500 hover:bg-blue-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New customer
            </button>
          )}
        </Balance>
      </div>

      {customers > 0 ? (
        <div className="pt-2 bg-white dark:bg-gray-900">
          <Suspense>
            <Customers />
          </Suspense>
        </div>
      ) : (
        <div className="w-full h-[65vh] flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="-mt-5 flex items-center justify-center flex-col text-gray-900 dark:text-white">
            <p>There is no customer. Please add your first customer!</p>
            <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
              <FaPlus /> Add First Customer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
