"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation"; // Pour accéder aux paramètres de l'URL
import { FaRegCheckCircle } from "react-icons/fa"; // Importez l'icône de vérification de Font Awesome

type CaisseProps = {
  id: string;
  name: string;
  value: number;
  color?: string;
};

const Caisse = ({ caisses }: { caisses: CaisseProps[] }) => {
  const searchParams = useSearchParams(); // Récupérer les paramètres de l'URL
  const activeCaisseId = searchParams.get("caisse"); // Récupérer la valeur du paramètre "caisse"

  return (
    <nav aria-label="Shortcuts Navigation" className="grid grid-cols-3 md:grid-cols-7 sm:grid-cols-5 gap-3 p-2 w-full">
      {caisses.map((caisse) => {
        const isActive = caisse.id === activeCaisseId; // Vérifier si la caisse est active

        return (
          <Link
            key={caisse.id}
            href={`?caisse=${caisse.id}`}
            title={caisse.name}
            aria-label={caisse.name}
            className={cn(
              "flex h-20 flex-col items-center justify-center rounded shadow-md dark:shadow-none dark:bg-[#262a2e] p-2 relative",
              "transition-all duration-300 transform hover:scale-105",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "bg-gradient-to-r",
              caisse.color || "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" // Valeur par défaut
            )}
          >
            {/* Icône de vérification si la caisse est active */}
            {isActive && (
              <div className="absolute bg-white p-1 rounded-full top-1 right-1 text-green-500">
                <FaRegCheckCircle />
              </div>
            )}

            <span className="text-xs">{caisse.name}</span>
            {caisse.value !== undefined && <b className="text-xs">{caisse.value.toLocaleString()} Ar</b>}
          </Link>
        );
      })}
    </nav>
  );
};

export default Caisse;
