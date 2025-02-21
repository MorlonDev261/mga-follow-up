import { HotTable } from '@handsontable/react';
import type { HotTableClass } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef, useCallback, useMemo } from 'react'; // Ajout de useMemo
import { exportToExcel } from './excel-utils';

interface FinancialDataRow {
  date: string;
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
    const exportData = data.map(row => [
      row.date,
      row.client,
      row.income,
      row.expenses,
      row.comments,
      row.net,
    ]);
    exportToExcel(exportData, colHeaders, 'financial-report');
  }, [data, colHeaders]); // colHeaders est maintenant stable grâce à useMemo

  const addRow = useCallback(() => {
    setData(prev => [
      ...prev,
      { date: '', client: '', income: 0, expenses: 0, comments: '', net: 0 }
    ]);
  }, []);

  const handleAfterChange = useCallback((
    changes: Handsontable.CellChange[] | null,
    source: Handsontable.ChangeSource
  ) => {
    if (source === 'edit' && changes) {
      setData(prev => {
        const newData = [...prev];
        changes.forEach(([row, prop, oldValue, newValue]) => {
          if (row >= newData.length || typeof prop !== 'string') return;

          const key = prop as keyof FinancialDataRow;
          const rowData = newData[row];

          if (key in rowData) {
            // Journaliser l'ancienne et la nouvelle valeur
            console.log(`Modification détectée dans la ligne ${row}, colonne ${key}:`);
            console.log(`- Ancienne valeur :`, oldValue);
            console.log(`- Nouvelle valeur :`, newValue);

            // Exemple de logique : annuler la modification si la nouvelle valeur est invalide
            if (key === 'income' || key === 'expenses') {
              const numericValue = Number(newValue);
              if (isNaN(numericValue) {
                console.warn(`La valeur "${newValue}" n'est pas un nombre valide. Annulation de la modification.`);
                return; // Annuler la modification
              }
            }

            // Appliquer la nouvelle valeur
            const numericKeys = ['income', 'expenses', 'net'];
            const value = numericKeys.includes(key) ? Number(newValue) || 0 : newValue;

            // @ts-expect-error - La validation est gérée par les colonnes
            rowData[key] = value;

            // Recalculer le net si income ou expenses a changé
            if (key === 'income' || key === 'expenses') {
              rowData.net = Number(rowData.income) - Number(rowData.expenses);
            }
          }
        });
        return newData;
      });
    }
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
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
        ref={hotTableRef}
        data={data}
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
        columnSorting={true}
        dropdownMenu={true}
        manualRowMove={true}
        manualColumnMove={true}
        afterChange={handleAfterChange}
        rowHeights={40}
        autoWrapRow={true}
        navigableHeaders={true}
        renderAllRows={true}
      />
    </div>
  );
};

export default ExcelTab;
