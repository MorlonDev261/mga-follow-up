import "./CSS/styles.css";
import { HotTable } from '@handsontable/react';
import type { HotTableClass } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef, useCallback, useMemo } from 'react'; // Ajout de useMemo
import { exportToExcel } from './excel-utils';

interface FinancialDataRow {
  date: string;
  client?: string;
  income?: number;
  expenses?: number;
  comments?: string;
  net?: number;
}

const ExcelTab = () => {
  const hotTableRef = useRef<HotTableClass | null>(null);
  const [dataRows, setDataRows] = useState<FinancialDataRow[]>([]);

    // Calcul du total net disponible
  const totalNet = useMemo(() => 
    dataRows.reduce((sum, row) => sum + row.net, 0), 
    [dataRows]
  );

  // Données incluant la ligne de totaux
  const dataWithTotal = useMemo(() => {
    const totalRow: FinancialDataRow = {
      date: '',
      comments: 'Total Net Available:',
      net: totalNet,
    };
    return dataRows.length > 0 ? [...dataRows.map(row => ({ ...row })), totalRow] : dataRows;
  }, [dataRows, totalNet]);

  // Utilisation de useMemo pour mémoriser colHeaders
  const colHeaders = useMemo(() => ['Date', 'Client', 'Income (AR)', 'Expenses (AR)', 'Comments', 'Net Available (AR)'], []);

  const columns = [
    { data: 'date', type: 'date', dateFormat: 'YYYY-MM-DD', validator: Handsontable.validators.DateValidator },
    { data: 'client', type: 'text' },
    { 
      data: 'income', 
      type: 'numeric', 
      numericFormat: { pattern: '0,0' },
      validator: (value: unknown, callback: (result: boolean) => void) => {
        callback(!isNaN(Number(value)) && Number(value) >= 0);
      }
    },
    { 
      data: 'expenses', 
      type: 'numeric', 
      numericFormat: { pattern: '0,0' },
      validator: (value: unknown, callback: (result: boolean) => void) => {
        callback(!isNaN(Number(value)) && Number(value) >= 0);
      }
    },
    { data: 'comments', type: 'text' },
    { data: 'net', type: 'numeric', readOnly: true, numericFormat: { pattern: '0,0' } },
  ];

  const handleExport = useCallback(() => {
  // Conversion des données en `FinancialDataRow[]`
  const formattedData: FinancialDataRow[] = dataRows.map(row => ({
    date: row.date,
    client: row.client || '',
    income: row.income ?? 0,
    expenses: row.expenses ?? 0,
    comments: row.comments || '',
    net: row.net,
  }));

  // Ajout de la ligne de total sous forme d'objet `FinancialDataRow`
  const totalRow: FinancialDataRow = {
    date: new Date().toISOString().split('T')[0], // Date actuelle
    client: '',
    income: undefined,
    expenses: undefined,
    comments: 'Total Net Available:',
    net: totalNet,
  };

  exportToExcel([...formattedData, totalRow], colHeaders, 'financial-report.xlsx');
}, [dataRows, colHeaders, totalNet]);


  const addRow = useCallback(() => {
    setDataRows(prev => [
      ...prev,
      { date: new Date().toISOString().split('T')[0], 
        client: '', 
        income: 0, 
        expenses: 0, 
        comments: '', 
        net: 0 }
    ]);
  }, []);

  const handleAfterChange = useCallback((
  changes: Handsontable.CellChange[] | null,
  source: Handsontable.ChangeSource
) => {
  if (source === 'edit' && changes) {
    setDataRows(prev => {
      return prev.map((row, index) => {
        const change = changes.find(([rowIndex]) => rowIndex === index);
        if (!change) return row; // Si aucune modification, on garde la ligne inchangée
        
        const [_, prop, __, newValue] = change;
        const key = prop as keyof FinancialDataRow;
        const numericKeys = ['income', 'expenses', 'net'];

        const updatedRow = { ...row };
        updatedRow[key] = numericKeys.includes(key) ? Number(newValue) || 0 : newValue;

        if (key === 'income' || key === 'expenses') {
          updatedRow.net = Number(updatedRow.income) - Number(updatedRow.expenses);
        }

        return updatedRow;
      });
    });
  }
}, []);

  return (
    <>
      <div className="mb-2 flex gap-4">
        <button 
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition-colors"
          onClick={handleExport}
        >
          Exporter en Excel
        </button>
        <button 
          className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition-colors"
          onClick={addRow}
        >
          Ajouter une ligne
        </button>
      </div>

      <HotTable
        className="handsontable dark-theme"
        ref={hotTableRef}
        data={dataWithTotal}
        colHeaders={colHeaders}
        columns={columns}
        height="600"
        width="100%"
        licenseKey="non-commercial-and-evaluation"
        contextMenu={{
          items: {
            row_above: {},
            row_below: {},
            remove_row: {},
            undo: {},
            redo: {}
          }
        }}
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
