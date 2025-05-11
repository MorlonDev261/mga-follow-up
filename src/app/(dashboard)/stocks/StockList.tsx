"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaRegCheckCircle } from "react-icons/fa";

type StockProps = {
  id: string;
  name: string;
  inStock?: number;
  sales?: number;
  color?: string;
};

const Stock = ({ stocks }: { stocks: StockProps[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeStock = searchParams.get("stock");

  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (id === activeStock) {
      // Supprimer le paramètre s’il est déjà actif
      params.delete("stock");
    } else {
      params.set("stock", id);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <nav
      aria-label="Shortcuts Navigation"
      className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3 p-2 w-full"
    >
      {stocks.map((stock) => {
        const isActive = stock.id === activeStock;

        return (
          <button
            key={stock.id}
            onClick={() => handleClick(stock.id)}
            title={stock.name}
            aria-label={stock.name}
            className={cn(
              "flex h-20 flex-col items-center justify-center rounded shadow-md dark:shadow-none dark:bg-[#262a2e] p-2 relative",
              "transition-all duration-300 transform hover:scale-105",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "bg-gradient-to-r",
              stock.color || "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
              isActive && "ring-2 ring-blue-500"
            )}
          >
            {isActive && (
              <div className="absolute bg-background p-1 rounded-full top-1 right-1 text-blue-500">
                <FaRegCheckCircle />
              </div>
            )}
            <span className="text-xs">{stock.name}</span>
            {stock.inStock !== undefined && (
              <b className="text-xs">{stock.inStock.toLocaleString()}</b>
            )}
            {stock.sales !== undefined && (
              <b className="text-xs">{stock.sales.toLocaleString()}</b>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default Stock;
