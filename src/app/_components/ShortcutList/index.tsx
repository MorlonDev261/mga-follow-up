import React from 'react';
import clsx from 'clsx';
import { FaDollarSign, FaCalendarAlt, FaCog, FaUsers, FaRegUserCircle } from 'react-icons/fa';
import { BsShopWindow } from "react-icons/bs";
import { FiDollarSign, FiClock } from 'react-icons/fi';

const shortcuts = [
  { label: 'Revenu', value: 457900, icon: <FaDollarSign />, color: 'text-green-500' }, // Vert
  { label: 'Depense', value: 457900, icon: <FiDollarSign />, color: 'text-red-500' }, // Rouge
  { label: 'Pending', value: 457900, icon: <FiClock />, color: 'text-yellow-500' }, // Jaune
  { label: 'Agenda', icon: <FaCalendarAlt /> }, // Bleu
  { label: 'Stock', value: 457900, icon: <BsShopWindow /> }, // Violet
  { label: 'Client', value: 7, icon: <FaUsers /> }, // Orange
  { label: 'Profile', icon: <FaRegUserCircle /> }, // Gris
  { label: 'Paramètre', icon: <FaCog /> }, // Brun
];

const ShortcutList = () => {
  return (
    <>
      {shortcuts.map((shortcut) => (
        <div
          key={shortcut.label}
          className={clsx(
            "flex h-20 flex-col items-center justify-center rounded bg-[#222] p-2 transition-colors duration-300 text-white",
            shortcut.color !== undefined && shortcut.color // Ajoute la couleur en hover dynamiquement
          )}
        >
          <span className="mb-1 text-xl">{shortcut.icon}</span>
          {shortcut.value !== undefined && <span className="text-xs">{shortcut.value}</span>}
          <span className="text-xs">{shortcut.label}</span>
        </div>
      ))}
    </>
  );
};

export default ShortcutList;
