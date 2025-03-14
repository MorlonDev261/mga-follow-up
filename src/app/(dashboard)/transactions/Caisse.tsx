"use client";

import React, { lazy, Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Lazy Load des icônes pour optimiser le chargement
const FaUsers = lazy(() => import("react-icons/fa").then((m) => ({ default: m.FaUsers })));
const BsShopWindow = lazy(() => import("react-icons/bs").then((m) => ({ default: m.BsShopWindow })));
const BsPersonWorkspace = lazy(() => import("react-icons/bs").then((m) => ({ default: m.BsPersonWorkspace })));
const FiDollarSign = lazy(() => import("react-icons/fi").then((m) => ({ default: m.FiDollarSign })));
const FiClock = lazy(() => import("react-icons/fi").then((m) => ({ default: m.FiClock })));
const SwapWallet = lazy(() => import("@icons").then((m) => ({ default: m.SwapWallet }))); // Vérifie si l'import est correct

// Liste des raccourcis
const shortcuts = [
  {
    label: "Caisse 1",
    to: "?caisse=uzRt253",
    value: 457900,
    color: "from-blue-500 to-blue-700 text-white",
  },
  {
    label: "Caisse 2",
    to: "?caisse=7264Yehf",
    value: 457900,
    color: "from-orange-500 to-orange-700 text-white",
  },
  {
    label: "Caisse 3",
    to: "?caisse=jdjbe59Jz",
    value: 457900,
    color: "from-yellow-400 to-yellow-600 text-white",
  },
  { 
    label: "Caisse 4", 
    to: "?caisse=7uet357eH",
    value: 4476900,
    color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" 
  },
  { 
    label: "Caisse 5", 
    to: "?caisse=zyegq753JsG",
    value: 4837900,
    color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" 
  },
  { 
    label: "Caisse 6", 
    to: "?caisse=djhe5292H",
    value: 364900,
    color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" 
  },
];

const Caisse = () => {
  return (
    <nav aria-label="Shortcuts Navigation" className="grid grid-cols-4 md:grid-cols-8 sm:grid-cols-6 gap-3 p-2 w-full">
      {shortcuts.map((shortcut) => (
        <Link
          key={shortcut.label}
          href={shortcut.to}
          title={shortcut.label} // Ajout du title pour le SEO
          aria-label={shortcut.label}
          className={cn(
            "flex h-20 flex-col items-center justify-center rounded shadow-md dark:shadow-none dark:bg-[#262a2e] p-2",
            "transition-all duration-300 transform hover:scale-105", // Animation de zoom
            "hover:bg-gray-100 dark:hover:bg-gray-700", // Changement de background au hover
            "bg-gradient-to-r", // Applique le gradient
            shortcut.color
          )}
        >
          <span className="text-xs">{shortcut.label}</span>
          {shortcut.value !== undefined && <b className="text-xs">{shortcut.value.toLocaleString()} Ar</b>}
        </Link>
      ))}
    </nav>
  );
};

export default Caisse;
