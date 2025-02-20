import React from 'react';
import { FaDollarSign, FaCalendarAlt, FaBox, FaCog } from 'react-icons/fa';
import { FiDollarSign, FiClock, FiUsers, FiUser } from 'react-icons/fi';

const shortcuts = [
  { label: 'Revenu', icon: <FaDollarSign /> },
  { label: 'Depense', icon: <FiDollarSign /> },
  { label: 'Pending', icon: <FiClock /> },
  { label: 'Agenda', icon: <FaCalendarAlt /> },
  { label: 'Stock', icon: <FaBox /> },
  { label: 'Client', icon: <FiUsers /> },
  { label: 'Profile', icon: <FiUser /> },
  { label: 'Paramètre', icon: <FaCog /> },
];

const ShortcutList = () => {
  return (
    <>
      {shortcuts.map((shortcut) => (
        <div
          key={shortcut.label}
          className="flex h-20 flex-col items-center justify-center rounded bg-[#222] p-2"
        >
          <span className="mb-1 text-xl">{shortcut.icon}</span>
          <span className="text-xs">{shortcut.label}</span>
        </div>
      ))}
    </>
  );
};

export default ShortcutList;
