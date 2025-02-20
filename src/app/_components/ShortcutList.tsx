import React from 'react';
import { FaDollarSign, FaCalendarAlt, FaBox, FaUser, FaCog } from 'react-icons/fa';
import { FiDollarSign, FiClock, FiUsers, FiUser } from 'react-icons/fi';

const shortcuts = [
  { label: 'Revenu', icon: <FaDollarSign /> }, // Icône de dollar pour le revenu
  { label: 'Depense', icon: <FiDollarSign /> }, // Icône de dollar pour la dépense
  { label: 'Pending', icon: <FiClock /> }, // Icône d'horloge pour "Pending"
  { label: 'Agenda', icon: <FaCalendarAlt /> }, // Icône de calendrier pour l'agenda
  { label: 'Stock', icon: <FaBox /> }, // Icône de boîte pour le stock
  { label: 'Client', icon: <FiUsers /> }, // Icône d'utilisateurs pour les clients
  { label: 'Profile', icon: <FiUser /> }, // Icône d'utilisateur pour le profil
  { label: 'Paramètre', icon: <FaCog /> }, // Icône d'engrenage pour les paramètres
];

const ShortcutList = () => {
  return (
    {shortcuts.map((shortcut, index) => (
      <div key={index} className="flex h-20 flex-col items-center justify-center rounded bg-[#222] p-2">
        <span className="mb-1 text-xl">{shortcut.icon}</span>
        <span className="text-xs">{shortcut.label}</span>
      </div>
    ))}
  );
};

export default ShortcutList;
