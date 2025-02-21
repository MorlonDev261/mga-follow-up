import { HotTable } from '@handsontable/react';
import type { HotTableClass } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useState, useRef, useCallback, useMemo } from 'react';
import { exportToExcel } from './excel-utils';
import './CSS/styles.css'; // Importez votre fichier CSS

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
      },
      renderer: (instance, td, row, col, prop, value) => {
        if (value > 500000) {
          td.style.backgroundColor = '#d4edda'; // Vert clair
        } else if (value > 0) {
          td.style.backgroundColor = '#fff3cd'; // Jaune clair
        }
        Handsontable.renderers.TextRenderer.apply(this, arguments);
      }
    },
    { 
      data: 'expenses', 
      type: 'numeric', 
      numericFormat: { pattern: '0,0' },
      validator: (value: unknown, callback: (result: boolean) => void) => {
        callback(!isNaN(Number(value)) && Number(value) >= 0);
      },
      renderer: (instance, td, row, col, prop, value) => {
        if (value > 300000) {
          td.style.backgroundColor = '#f8d7da'; // Rouge clair
        }
        Handsontable.renderers.TextRenderer.apply(this, arguments);
      }
    },
    { data: 'comments', type: 'text' },
    { 
      data: 'net', 
      type: 'numeric', 
      readOnly: true, 
      numericFormat: { pattern: '0,0' },
      renderer: (instance, td, row, col, prop, value) => {
        if (value < 0) {
          td.style.backgroundColor = '#f8d7da'; // Rouge clair
          td.style.color = '#721c24'; // Texte rouge foncé
        } else {
          td.style.backgroundColor = '#d4edda'; // Vert clair
          td.style.color = '#155724'; // Texte vert foncé
        }
        Handsontable.renderers.TextRenderer.apply(this, arguments);
      }
    },
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
  }, [data, colHeaders]);

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
            const numericKeys = ['income', 'expenses', 'net'];
            const value = numericKeys.includes(key) ? Number(newValue) || 0 : newValue;

            // @ts-expect-error - La validation est gérée par les colonnes
            rowData[key] = value;

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
            col_left: {},
            col_right: {},
            remove_col: {},
            undo: {},
            redo: {},
            change_color: {
              name: 'Changer la couleur',
              callback: function(key, selection) {
                const { start, end } = selection[0];
                const hot = this;

                const color = prompt('Entrez une couleur (ex: #ff0000, red, rgb(255, 0, 0)):');

                if (color) {
                  for (let row = start.row; row <= end.row; row++) {
                    for (let col = start.col; col <= end.col; col++) {
                      const cell = hot.getCell(row, col);
                      if (cell) {
                        cell.style.backgroundColor = color;
                      }
                    }
                  }
                }
              }
            }
          }
        }}
        stretchH="all"
        dropdownMenu={true}
        manualRowMove={true}
        manualColumnMove={true}
        afterChange={handleAfterChange}
        rowHeights={40}
        autoWrapRow={true}
        navigableHeaders={true}
        renderAllRows={true}
        selectionMode="range"
      />
    </>
  );
};

export default ExcelTab;
