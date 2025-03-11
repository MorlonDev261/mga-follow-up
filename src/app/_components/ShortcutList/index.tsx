import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { FaUsers } from "react-icons/fa";
import { BsShopWindow, BsPersonWorkspace } from "react-icons/bs";
import { SwapWallet } from "@icons";
import { FiDollarSign, FiClock } from "react-icons/fi";

const shortcuts = [
  { label: "Stock", to: "/stock", value: 457900, icon: <BsShopWindow />, color: "text-blue-500" },
  { label: "Expenses", to: "/expenses", value: 457900, icon: <FiDollarSign />, color: "text-red-500" },
  { label: "Pending", to: "/pending", value: 457900, icon: <FiClock />, color: "text-yellow-500" },
  { label: "Employers", to: "/employers", value: 7, icon: <BsPersonWorkspace /> },
  { label: "Transactions", to: "/transactions", icon: <SwapWallet /> },
  { label: "Customers", to: "/customers", value: 7, icon: <FaUsers /> },
];

const ShortcutList = () => {
  return (
    <>
      {shortcuts.map((shortcut) => (
        <Link
          key={shortcut.label}
          href={shortcut.to}
          className={clsx(
            "flex h-20 flex-col items-center justify-center rounded shadow-[0px_0px_3px_rgba(0,0,0,0.2)] dark:shadow-none dark:bg-[#262a2e] p-2",
            "transition-all duration-300 transform hover:scale-105", // Animation de zoom
            "hover:bg-gray-100 dark:hover:bg-gray-700", // Changement de background
            shortcut.color ? shortcut.color : ""
          )}
        >
          <span className="mb-1 text-xl">{shortcut.icon}</span>
          {shortcut.value !== undefined && <b className="text-xs">{shortcut.value} Ar</b>}
          <span className="text-xs">{shortcut.label}</span>
        </Link>
      ))}
    </>
  );
};

export default ShortcutList;
