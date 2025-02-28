import React from "react";
import { BsShopWindow } from "react-icons/bs";
import Balance from "@components/Balance";
import Statistique from '@components/Statistique';
import DataTableMain from "@components/DataTable/DataTableMain";


export default function Dashboard() {
  
  return (
    <main className="p-2">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[#111] p-2">
          <Balance 
            title={<><BsShopWindow /> Stock Available</>} 
            subtitle={<>= Total Sales : <Counter end={4350} duration={0.8} /></>}
            balance={<><Counter end={5220500} duration={0.8} sound="on" src="/sounds/money-sound.mp3" /> Ar</>}
          >
        </div>
        <div className="bg-[#111] text-white p-2">
          <h3 className="mb-4">Statistique de vente:</h3>
          <div className="mb-5 w-full">
            <Statistique type="courbe" legende={false} />
          </div>
        </div>
      </div>
    </div>
    <DataTableMain />
   </main>
 );
}
