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
    label: "Stock",
    to: "/stocks",
    value: 457900,
    icon: <BsShopWindow />,
    color: "from-blue-500 to-blue-700 text-white",
  },
  {
    label: "Expenses",
    to: "/expenses",
    value: 457900,
    icon: <FiDollarSign />,
    color: "from-orange-500 to-orange-700 text-white",
  },
  {
    label: "Pending",
    to: "/pending",
    value: 457900,
    icon: <FiClock />,
    color: "from-yellow-400 to-yellow-600 text-white",
  },
  { label: "Employers", to: "/employers", icon: <BsPersonWorkspace />, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  { label: "Transactions", to: "/transactions", icon: <SwapWallet />, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  { label: "Customers", to: "/customers", icon: <FaUsers />, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
];

const ShortcutList = () => {
  return (
    <nav aria-label="Shortcuts Navigation" className="grid grid-cols-3 gap-3 p-4">
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
          {/* Icône en Lazy Load */}
          <Suspense fallback={<span className="animate-pulse">Loading...</span>}>
            <span className="mb-1 text-xl">{shortcut.icon}</span>
          </Suspense>
          {shortcut.value !== undefined && <b className="text-xs">{shortcut.value.toLocaleString()} Ar</b>}
          <span className="text-xs">{shortcut.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default ShortcutList;
