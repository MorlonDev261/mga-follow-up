import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions } from 'chart.js';

// Enregistrement des éléments nécessaires pour chaque type de graphique
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

interface StatistiqueProps {
  type?: 'courbe' | 'rond';
  position?: 'top' | 'right' | 'bottom' | 'left';
  legende?: boolean;
}

export default function Statistique({ type = 'rond', position = 'bottom', legende = true }: StatistiqueProps) {
  // Données pour le graphique en courbe (Ligne)
  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Produits vendus',
        data: [10, 20, 15, 30, 25, 40, 35, 50, 45, 60, 55, 70],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Données pour le graphique en rond (Doughnut)
  const doughnutData = {
    labels: ['Net available', 'Expenses', 'Pending'],
    datasets: [
      {
        label: 'Statistiques',
        data: [656000, 25000, 456000],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderWidth: 0,
      },
    ],
  };

  // Options spécifiques pour le graphique en courbe
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: {
        display: legende, // Affiche ou masque la légende
        position,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Options spécifiques pour le graphique en rond (Doughnut)
  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: {
        display: legende, // Affiche ou masque la légende
        position,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <>
      {type === 'courbe' ? (
        <Line data={lineData} options={lineOptions} />
      ) : (
        <Doughnut data={doughnutData} options={doughnutOptions} />
      )}
    </>
  );
}
