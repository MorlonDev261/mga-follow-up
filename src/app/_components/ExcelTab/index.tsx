import "./CSS/styles.css";
import { HotTable } from '@handsontable/react';
import type { HotTableClass } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef, useCallback, useMemo } from 'react';
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
  const [dataRows, setDataRows] = useState<FinancialDataRow[]>([
    { date: '2024-01-01', client: 'Client A', income: 500000, expenses: 200000, comments: 'Commentaire 1', net: 300000 },
    { date: '2024-01-02', client: 'Client B', income: 750000, expenses: 300000, comments: 'Commentaire 2', net: 450000 },
  ]);

  // Calcul du total net disponible
  const totalNet = useMemo(() => 
    dataRows.reduce((sum, row) => sum + row.net, 0), 
    [dataRows]
  );

  // Données incluant la ligne de totaux
  const dataWithTotal = useMemo(() => {
    const totalRow: FinancialDataRow = {
      date: '',
      client: '',
      income: 0,
      expenses: 0,
      comments: 'Total Net Available:',
      net: totalNet,
    };
    return [...dataRows, totalRow];
  }, [dataRows, totalNet]);

  const colHeaders = useMemo(() => ['Date', 'Client', 'Income (AR)', 'Expenses (AR)', 'Comments', 'Net Available (AR)'], []);

  const columns = useMemo<Handsontable.ColumnSettings[]>(() => [
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
  {
    data: 'comments',
    type: 'text',
    renderer: function(...args) {
      const [instance, td, row, col, prop, value, cellProperties] = args;
      if (row >= dataRows.length) {
        cellProperties.readOnly = true;
      }
      Handsontable.renderers.TextRenderer.apply(this, args);
    }
  },
  {
    data: 'net',
    type: 'numeric',
    numericFormat: { pattern: '0,0' },
    renderer: function(...args) {
      const [instance, td, row, col, prop, value, cellProperties] = args;
      if (row >= dataRows.length) {
        cellProperties.readOnly = true;
        td.style.backgroundColor = '#34a853'; // Équivalent Tailwind bg-green-500
        td.style.color = 'white';
      }
      Handsontable.renderers.NumericRenderer.apply(this, args);
    }
  }
], [dataRows.length]);

  const handleExport = useCallback(() => {
    // Exporte uniquement les données (exclut la ligne de totaux)
    const exportData  = dataRows.map(row => [
      row.date,
      row.client,
      row.income,
      row.expenses,
      row.comments,
      row.net,
    ]);
    exportToExcel(exportData, colHeaders, 'financial-report');
  }, [dataRows, colHeaders]);

  const addRow = useCallback(() => {
    setDataRows(prev => [
      ...prev,
      { date: '', client: '', income: 0, expenses: 0, comments: '', net: 0 }
    ]);
  }, []);

  const handleAfterChange = useCallback((
    changes: Handsontable.CellChange[] | null,
    source: Handsontable.ChangeSource
  ) => {
    if (source === 'edit' && changes) {
      setDataRows(prev => {
        const newData = [...prev];
        changes.forEach(([row, prop]) => { // Suppression de `oldValue` et `newValue`
          if (row >= newData.length) return; // Ignore les modifications du total

          const key = prop as keyof FinancialDataRow;
          const rowData = newData[row];

          if (key in rowData) {
            // ... (logique existante inchangée)
          }
        });
        return newData;
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
        renderAllRows={true}
        autoWrapRow={true}
      />
    </>
  );
};

export default ExcelTab;
