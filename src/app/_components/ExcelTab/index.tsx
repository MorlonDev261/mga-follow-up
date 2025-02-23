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
  net: number;
}

const ExcelTab = () => {
  const hotTableRef = useRef<HotTableClass | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataRows, setDataRows] = useState<FinancialDataRow[]>([
    { date: new Date().toISOString().split('T')[0], net: 0 }
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
      comments: 'Total Net Available:',
      net: totalNet,
    };
    return [...dataRows, totalRow];
  }, [dataRows, totalNet]);

  // Utilisation de useMemo pour mémoriser colHeaders
  const colHeaders = useMemo(() => ['Date', 'Client', 'Income (AR)', 'Expenses (AR)', 'Comments', 'Net Available (AR)'], []);

  const columns = [
    { data: 'date', type: 'date', dateFormat: 'YYYY-MM-DD', validator: Handsontable.validators.DateValidator },
    { 
      data: 'client', 
      type: 'dropdown', 
      source: ['Client A', 'Client B', 'Client C']
    },
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
    income: row.income ?? undefined,
    expenses: row.expenses ?? undefined,
    comments: row.comments || '',
    net: row.net,
  }));

  // Ajout de la ligne de total sous forme d'objet `FinancialDataRow`
  const totalRow: FinancialDataRow = {
    date: new Date().toISOString().split('T')[0], // Date actuelle
    comments: 'Total Net Available:',
    net: totalNet,
  };

  exportToExcel([...formattedData, totalRow], colHeaders, 'financial-report.xlsx');
}, [dataRows, colHeaders, totalNet]);


  const addRow = useCallback(() => {
    setDataRows(prev => {
      const lastRow = prev[prev.length - 1];
      setErrorMessage(null);

      // Vérifie si la dernière ligne a une valeur pour income ou expenses
      if (lastRow && (lastRow.income !== undefined || lastRow.expenses !== undefined)) {
        return [
          ...prev,
          { 
            date: new Date().toISOString().split('T')[0],
            client: '', 
            income: undefined, 
            expenses: undefined, 
            comments: '', 
            net: 0 
          }
        ];
      }

    // Afficher un message d'erreur si income et expenses sont vides
    setErrorMessage("Veuillez remplir 'Income' ou 'Expenses' avant d'ajouter une nouvelle ligne.");
    return;
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
              if (isNaN(numericValue)) {
                console.warn(`La valeur "${newValue}" n'est pas un nombre valide. Annulation de la modification.`);
                return; // Annuler la modification
              }
            }

            // Appliquer la nouvelle valeur
            const numericKeys = ['income', 'expenses', 'net'];
            const value = numericKeys.includes(key) ? Number(newValue) || undefined : newValue;

            // @ts-expect-error - La validation est gérée par les colonnes
            rowData[key] = value;

            // Recalculer le net si income ou expenses a changé
            if (key === 'income' || key === 'expenses') {
              rowData.net = Number(rowData.income ?? 0) - Number(rowData.expenses ?? 0);
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
      
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}

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
