"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaRegCheckCircle, FaRegCalendarAlt } from "react-icons/fa";

const stocks = [
  { id: 'hzhe58', name: '24-03-25', value: 457900, sales: 3636 },
  { id: 'jrfhz8', name: '01-02-25', value: 457900, sales: 846 },
  { id: 'hzshr8', name: '24-01-25', value: 457900, sales: 5353 },
  { id: 'ryhey6', name: '07-02-25', value: 7, sales: 35 },
  { id: 'hry488', name: '10-02-25', value: 53, sales: 386 },
  { id: 'hjfe58', name: '14-02-25', value: 7, sales: 5263 },
  { id: 'hzjrj8', name: '06-03-25', value: 568, sales: 56 },
  { id: 'hkrjra', name: '08-03-25', value: 567, sales: 56 },
];

type StockProps = {
  id: string;
  name: string;
  inStock?: number;
  sales?: number;
  value?: number;
  color?: string;
};

type StockListProps = { stocks: StockProps[] };

const StockList = ({ stocks }: StockListProps) => {
  const searchParams = useSearchParams();
  const activeStockId = searchParams.get("stock");

  return (
    <nav className="grid grid-cols-3 md:grid-cols-7 sm:grid-cols-5 gap-3 p-2 w-full">
      {stocks.map((stock) => {
        const isActive = stock.id === activeStockId;

        return (
          <Link
            key={stock.id}
            href={`?stock=${stock.id}`}
            className={cn(
              "flex h-20 flex-col items-center justify-center rounded shadow-md dark:shadow-none dark:bg-[#262a2e] p-2 relative",
              "transition-all duration-300 transform hover:scale-105",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              stock.color || "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            )}
          >
            {isActive && (
              <div className="absolute bg-background p-1 rounded-full top-1 right-1 text-green-500">
                <FaRegCheckCircle />
              </div>
            )}
            <FaRegCalendarAlt />
            <span className="text-xs">{stock.name}</span>
            {stock.value !== undefined && <b className="text-xs">{stock.value.toLocaleString()} Ar</b>}
          </Link>
        );
      })}
    </nav>
  );
};

export default StockList;
