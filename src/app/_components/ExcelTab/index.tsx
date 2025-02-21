import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef } from 'react';
import { exportToExcel, importFromExcel } from './excel-utils';

const ExcelTab = () => {
  const hotTableRef = useRef(null);
  const [data, setData] = useState([
    // Données initiales
    ['2024-01-01', 'Client A', 500000, 200000, 'Commentaire 1', 300000],
    ['2024-01-02', 'Client B', 750000, 300000, 'Commentaire 2', 450000],
  ]);

  const columns = [
    { type: 'date', dateFormat: 'YYYY-MM-DD', title: 'Date' },
    { title: 'Client' },
    { type: 'numeric', title: 'Income (AR)', format: '0,0' },
    { type: 'numeric', title: 'Expenses (AR)', format: '0,0' },
    { title: 'Comments' },
    { 
      type: 'numeric', 
      title: 'Net Available (AR)', 
      readOnly: true,
      formula: 'ROW(INDIRECT("RC[-2]", FALSE)-INDIRECT("RC[-1]", FALSE))'
    }
  ];

  
  const handleExport = () => {
    exportToExcel(data, 'financial-report');
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const importedData = await importFromExcel(file);
      setData(importedData);
    }
  };


  return (
    <>
    <div className="p-4">
      <HotTable
        ref={hotTableRef}
        data={data}
        colHeaders={true}
        rowHeaders={true}
        columns={columns}
        height="600"
        width="100%"
        licenseKey="non-commercial-and-evaluation" // Clé pour usage non-commercial
        contextMenu={true}
        formulas={true}
        stretchH="all"
        columnSorting={true}
        dropdownMenu={true}
        manualRowMove={true}
        manualColumnMove={true}
      />
    </div>
    {/* Options supplémentaires */}
      <div className="mt-4 flex gap-4">
        <button className="bg-blue-500 px-4 py-2 rounded" onClick={handleExport}>
          Exporter en Excel
        </button>
        <button className="bg-green-500 px-4 py-2 rounded" onClick={handleImport}>
          Ajouter une ligne
        </button>
      </div>
    </>
  );
};

export default ExcelTab;
