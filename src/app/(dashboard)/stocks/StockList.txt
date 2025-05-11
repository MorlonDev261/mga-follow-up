"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaRegCheckCircle, FaRegCalendarAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

type Stock = {
  id: string;
  name: string;
  inStock?: number;
  sales?: number;
  value?: number;
  color?: string;
};

const StockList = ({ stocks }: { stocks: Stock[] }) => {
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
