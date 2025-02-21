import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef } from 'react';
import { exportToExcel } from './excel-utils';

const ExcelTab = () => {
  const hotTableRef = useRef<HotTable | null>(null);
  const [data, setData] = useState([
    ['2024-01-01', 'Client A', 500000, 200000, 'Commentaire 1', 300000],
    ['2024-01-02', 'Client B', 750000, 300000, 'Commentaire 2', 450000],
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
    if (hotTableRef.current) {
      const hotInstance = hotTableRef.current.hotInstance;
      hotInstance.alter('insert_row', hotInstance.countRows());
      setData([...data, []]);
    }
  };

  return (
    <>
      <div className="p-4">
        <HotTable
          ref={hotTableRef}
          data={data}
          colHeaders={colHeaders}
          rowHeaders={true}
          columns={columns}
          height="600"
          width="100%"
          licenseKey="non-commercial-and-evaluation"
          contextMenu={true}
          formulas={true} // Assurez-vous d'avoir activé le plugin Formulas
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
