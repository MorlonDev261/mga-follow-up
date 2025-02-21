import ExcelJS from 'exceljs';

interface FinancialDataRow {
  date: string; // Format YYYY-MM-DD
  client: string;
  income: number;
  expenses: number;
  comments: string;
  net: number;
}

export const exportToExcel = (data: FinancialDataRow[]): void => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Financial Data');

  // En-têtes des colonnes
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Client', key: 'client', width: 20 },
    { header: 'Income (AR)', key: 'income', width: 15 },
    { header: 'Expenses (AR)', key: 'expenses', width: 15 },
    { header: 'Comments', key: 'comments', width: 30 },
    { header: 'Net Available (AR)', key: 'net', width: 15 },
  ];

  // Ajout des données dans le fichier Excel
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Génération et téléchargement du fichier Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'financial-data.xlsx';
    link.click();
  });
};
