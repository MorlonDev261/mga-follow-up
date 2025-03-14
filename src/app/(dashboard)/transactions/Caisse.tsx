"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type CaisseProps = {
  id: string;
  name: string;
  value: number;
  color?: string;
};

const Caisse = ({ caisses }: { caisses: CaisseProps[] }) => {
  return (
    <nav aria-label="Shortcuts Navigation" className="grid grid-cols-4 md:grid-cols-8 sm:grid-cols-6 gap-3 p-2 w-full">
      {caisses.map((caisse) => (
        <Link
          key={caisse.id}
          href={`?caisse=${caisse.id}`}
          title={caisse.name}
          aria-label={caisse.name}
          className={cn(
            "flex h-20 flex-col items-center justify-center rounded shadow-md dark:shadow-none dark:bg-[#262a2e] p-2",
            "transition-all duration-300 transform hover:scale-105",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "bg-gradient-to-r",
            caisse.color || "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" // Valeur par défaut
          )}
        >
          <span className="text-xs">{caisse.name}</span>
          {caisse.value !== undefined && <b className="text-xs">{caisse.value.toLocaleString()} Ar</b>}
        </Link>
      ))}
    </nav>
  );
};

export default Caisse;
