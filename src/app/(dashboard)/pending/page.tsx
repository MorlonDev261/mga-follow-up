import React, { Suspense } from "react";
import Pending from "@components/Table/Pending";

export default function MyComponent() {
  const pending = true;
  
  return (
    <main>
      <div className="px-2 bg-[#111]">
        <h2 className="text-lg">Pending payment</h2>
        {pending ? 
          <h3 className="text-blue-500">250,000 Ar</h3> : 
          <p className="text-green-500">No pending payement.</p>
        }
      </div>
      <Suspense>
        <Pending />
      </Suspense>
    </main>
  );
}
