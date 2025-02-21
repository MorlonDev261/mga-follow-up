import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef } from 'react';
import { exportToExcel } from './excel-utils';

const ExcelTab = () => {
  const hotTableRef = useRef<HotTable>(null);
  const [data, setData] = useState<(string | number)[][]>([
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
    const formattedData = data.map(row => ({
      date: row[0] as string,
      client: row[1] as string,
      income: row[2] as number,
      expenses: row[3] as number,
      comments: row[4] as string,
      net: row[5] as number,
    }));
    
    exportToExcel(formattedData, 'financial-report.xlsx');
  };

  const addRow = () => {
    const newRow: (string | number)[] = ['', '', 0, 0, '', 0]; // Nouvelle ligne vide
    setData(prevData => [...prevData, newRow]);

    if (hotTableRef.current) {
      const hotInstance = hotTableRef.current.getInstance();
      hotInstance.alter('insert_row', hotInstance.countRows());
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
          stretchH="all"
          columnSorting={true}
          dropdownMenu={true}
          manualRowMove={true}
          manualColumnMove={true}
          afterChange={(changes, source) => {
            if (source !== 'loadData' && changes) {
              setData(prevData => {
                const newData = [...prevData];
                changes.forEach(([row, col, , newValue]) => {
                  newData[row][col] = newValue;
                });
                return newData;
              });
            }
          }}
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
