import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef } from 'react';

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

  return (
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
  );
};

export default ExcelTab;
