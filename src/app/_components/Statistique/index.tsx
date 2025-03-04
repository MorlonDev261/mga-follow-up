import React from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartOptions } from 'chart.js';

// Enregistrement des éléments nécessaires pour chaque type de graphique
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface StatistiqueProps {
  type?: 'courbe' | 'rond' | 'bar';
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
        data: [6, 20, 15, 58, 33, 27, 47, 50, 68, 100, 55, 120],
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
        data: [5220500, 457900, 457900],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderWidth: 0,
      },
    ],
  };

  // Données pour le graphique en barres
  const barData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Chiffre d\'affaires',
        data: [12000, 18500, 21000, 32000, 40000, 37000, 49000, 53000, 62000, 70000, 75000, 82000],
        backgroundColor: '#2196F3',
        borderWidth: 1,
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
        display: legende,
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
        display: legende,
        position,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Options spécifiques pour le graphique en barres
  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: {
        display: legende,
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
      ) : type === 'bar' ? (
        <Bar data={barData} options={barOptions} />
      ) : (
        <Doughnut data={doughnutData} options={doughnutOptions} />
      )}
    </>
  );
}
