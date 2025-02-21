import { HotTable, HotTableClass } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef } from 'react';
import { exportToExcel } from './excel-utils';

interface FinancialDataRow {
  date: string; // Format YYYY-MM-DD
  client: string;
  income: number;
  expenses: number;
  comments: string;
  net: number;
}

const ExcelTab = () => {
  const hotTableRef = useRef<HotTableClass | null>(null);
  const [data, setData] = useState<FinancialDataRow[]>([
    { date: '2024-01-01', client: 'Client A', income: 500000, expenses: 200000, comments: 'Commentaire 1', net: 300000 },
    { date: '2024-01-02', client: 'Client B', income: 750000, expenses: 300000, comments: 'Commentaire 2', net: 450000 },
  ]);

  const colHeaders = ['Date', 'Client', 'Income (AR)', 'Expenses (AR)', 'Comments', 'Net Available (AR)'];

  const columns = [
    { type: 'date', dateFormat: 'YYYY-MM-DD' },
    { type: 'text' },
    { type: 'numeric', numericFormat: { pattern: '0,0' } },
    { type: 'numeric', numericFormat: { pattern: '0,0' } },
    { type: 'text' },
    { type: 'numeric', readOnly: true },
  ];

  const handleExport = () => {
    exportToExcel(data, 'financial-report');
  };

  const addRow = () => {
    const newRow: FinancialDataRow = {
      date: '',
      client: '',
      income: 0,
      expenses: 0,
      comments: '',
      net: 0,
    };

    setData([...data, newRow]);
  };

  return (
    <>
      <div className="p-4">
        <HotTable
          ref={hotTableRef}
          data={data.map(({ date, client, income, expenses, comments, net }) => [date, client, income, expenses, comments, net])} // Conversion en tableau de tableaux
          colHeaders={colHeaders}
          rowHeaders={true}
          columns={columns}
          height="600"
          width="100%"
          licenseKey="non-commercial-and-evaluation"
          contextMenu={true}
          formulas={true}
          stretchH="all"
          columnSorting={true}
          dropdownMenu={true}
          manualRowMove={true}
          manualColumnMove={true}
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={handleExport}>
          Exporter en Excel
        </button>
        <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={addRow}>
          Ajouter une ligne
        </button>
      </div>
    </>
  );
};

export default ExcelTab;
