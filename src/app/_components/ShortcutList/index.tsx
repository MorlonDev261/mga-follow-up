import React from 'react';
import clsx from 'clsx';
import { FaCog, FaUsers, FaRegUserCircle } from 'react-icons/fa';
import { BsShopWindow, BsPersonWorkspace } from "react-icons/bs";
import { FiDollarSign, FiClock } from 'react-icons/fi';

const shortcuts = [
  { label: 'Stock', value: 457900, icon: <BsShopWindow />, color: 'text-blue-500' },
  { label: 'Expenses', value: 457900, icon: <FiDollarSign />, color: 'text-red-500' },
  { label: 'Pending', value: 457900, icon: <FiClock />, color: 'text-yellow-500' },
  { label: 'Employers', value: 7, icon: <BsPersonWorkspace /> },
  { label: 'Profile', icon: <FaRegUserCircle /> },
  { label: 'Customers', value: 7, icon: <FaUsers /> },
  { label: 'Settings', icon: <FaCog /> },
];

const ShortcutList = () => {
  return (
    <>
      {shortcuts.map((shortcut) => (
        <div
          key={shortcut.label}
          className={clsx(
            "flex h-20 flex-col items-center justify-center rounded bg-[#222] hover:bg-[#333] p-2 transition-colors duration-300",
            shortcut.color !== undefined ? shortcut.color : "text-white" // Ajoute la couleur en hover dynamiquement
          )}
        >
          <span className="mb-1 text-xl">{shortcut.icon}</span>
          {shortcut.value !== undefined && <b className="text-xs">{shortcut.value} Ar</b>}
          <span className="text-xs">{shortcut.label}</span>
        </div>
      ))}
    </>
  );
};

export default ShortcutList;
