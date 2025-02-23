import "./CSS/styles.css";
import { HotTable } from '@handsontable/react';
import type { HotTableClass } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { exportToExcel } from './excel-utils';

interface FinancialDataRow {
  id: string;
  date: string;
  client?: string;
  income?: number;
  expenses?: number;
  comments?: string;
  net: number;
}

const ExcelTab = () => {
  const hotTableRef = useRef<HotTableClass | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataRows, setDataRows] = useState<FinancialDataRow[]>([
    { id: uuidv4(), date: new Date().toISOString().split('T')[0], net: 0 }
  ]);

  const totalNet = useMemo(() => 
    dataRows.reduce((sum, row) => sum + row.net, 0), 
    [dataRows]
  );

  const dataWithTotal = useMemo(() => {
    const totalRow: FinancialDataRow = {
      id: 'total',
      date: '',
      comments: 'Total Net Available:',
      net: totalNet,
    };
    return [...dataRows, totalRow];
  }, [dataRows, totalNet]);

  const colHeaders = useMemo(() => ['Date', 'Client', 'Income (AR)', 'Expenses (AR)', 'Comments', 'Net Available (AR)'], []);

  const columns = [
    { data: 'date', type: 'date', dateFormat: 'YYYY-MM-DD', validator: Handsontable.validators.DateValidator },
    { data: 'client', type: 'dropdown', source: ['Client A', 'Client B', 'Client C'] },
    { 
      data: 'income', 
      type: 'numeric', 
      numericFormat: { pattern: '0,0' },
      validator: (value: unknown, callback: (result: boolean) => void) => {
        callback(value === '' || value === null || value === undefined || (!isNaN(Number(value)) && Number(value) >= 0));
      }
    },
    { 
      data: 'expenses', 
      type: 'numeric', 
      numericFormat: { pattern: '0,0' },
      validator: (value: unknown, callback: (result: boolean) => void) => {
        callback(value === '' || value === null || value === undefined || (!isNaN(Number(value)) && Number(value) >= 0));
      }
    },
    { data: 'comments', type: 'text' },
    { data: 'net', type: 'numeric', readOnly: true, numericFormat: { pattern: '0,0' } },
  ];

  const handleExport = useCallback(() => {
    exportToExcel([...dataRows, { id: 'total', date: '', comments: 'Total Net Available:', net: totalNet }], colHeaders, 'financial-report.xlsx');
  }, [dataRows, colHeaders, totalNet]);

  const addRow = useCallback(() => {
    setDataRows(prev => {
      const lastRow = prev[prev.length - 1];
      setErrorMessage(null);

      if (lastRow && (lastRow.income !== undefined || lastRow.expenses !== undefined)) {
        return [
          ...prev,
          { 
            id: uuidv4(),
            date: new Date().toISOString().split('T')[0],
            client: '', 
            income: undefined, 
            expenses: undefined, 
            comments: '', 
            net: 0 
          }
        ];
      }

      setErrorMessage("Veuillez remplir 'Income' ou 'Expenses' avant d'ajouter une nouvelle ligne.");
      return [...prev];
    });
  }, []);

  const handleAfterChange = useCallback((
    changes: Handsontable.CellChange[] | null,
    source: Handsontable.ChangeSource
  ) => {
    if (source === 'edit' && changes) {
      setDataRows(prev => {
        const newData = [...prev];

        changes.forEach(([row, prop, oldValue, newValue]) => {
          if (row >= newData.length || typeof prop !== 'string') return;
          if (oldValue === newValue) return;

          const key = prop as keyof FinancialDataRow;
          const rowData = newData[row];

          if (key in rowData) {
            if (key === 'income' || key === 'expenses') {
              const numericValue = Number(newValue);
              rowData[key] = isNaN(numericValue) ? undefined : numericValue;
              rowData.net = Number(rowData.income ?? 0) - Number(rowData.expenses ?? 0);
            } else {
              rowData[key] = newValue;
            }
          }
        });

        return newData;
      });
    }
  }, []);

  return (
    <>
      <div className="mb-2 flex gap-4">
        <button className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition-colors" onClick={handleExport}>
          Exporter en Excel
        </button>
        <button className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition-colors" onClick={addRow}>
          Ajouter une ligne
        </button>
      </div>
      {errorMessage && (<p className="text-red-500 text-sm mb-2">{errorMessage}</p>)}
      <HotTable
        className="handsontable dark-theme"
        ref={hotTableRef}
        data={dataWithTotal}
        colHeaders={colHeaders}
        columns={columns}
        height="600"
        width="100%"
        licenseKey="non-commercial-and-evaluation"
        contextMenu={{ items: { row_above: {}, row_below: {}, remove_row: {}, undo: {}, redo: {} } }}
        stretchH="all"
        afterChange={handleAfterChange}
        minRows={20}
        viewportRowRenderingOffset="auto"
        rowHeights={40}
        navigableHeaders={true}
        renderAllRows={true}
        autoWrapRow={true}
      />
    </>
  );
};

export default ExcelTab;
