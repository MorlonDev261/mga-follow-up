import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Statistique() {
  const chartData = {
    labels: ['Revenu', 'Dépense', 'Pending'],
    datasets: [
      {
        label: 'Statistiques',
        data: [65, 25, 10],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const, // Légende en bas
      },
      tooltip: {
        enabled: true, // Activer les tooltips
      },
    },
  };

  return (
    <div className="w-60 h-60">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
