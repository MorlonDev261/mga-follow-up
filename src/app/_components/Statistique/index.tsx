import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// Enregistrement des éléments nécessaires pour chaque type de graphique
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

interface StatistiqueProps {
  type?: 'courbe' | 'rond'; // Définition des types possibles
}

export default function Statistique({ type = 'rond' }: StatistiqueProps) {
  // Données pour le graphique en courbe (Ligne)
  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'], // Mois
    datasets: [
      {
        label: 'Nombre de Produits',
        data: [10, 20, 15, 30, 25, 40, 35, 50, 45, 60, 55, 70], // Valeurs pour chaque mois
        borderColor: '#4CAF50', // Couleur de la ligne
        backgroundColor: 'rgba(76, 175, 80, 0.2)', // Couleur de fond avec opacité
        borderWidth: 2,
        fill: true,
        tension: 0.3, // Rend la ligne plus fluide
      },
    ],
  };

  // Données pour le graphique en rond (Doughnut)
  const doughnutData = {
    labels: ['Revenu', 'Dépense', 'Pending'],
    datasets: [
      {
        label: 'Statistiques',
        data: [65, 25, 10], // Valeurs en pourcentage
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'], // Couleurs
        borderWidth: 0,
      },
    ],
  };

  // Options générales pour éviter les marges inutiles
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
  };

  return (
    <>
      {type === 'courbe' ? (
        <Line data={lineData} options={options} />
      ) : (
        <Doughnut data={doughnutData} options={options} />
      )}
    </>
  );
}
