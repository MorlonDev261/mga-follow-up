import ExcelJS from 'exceljs';

interface FinancialDataRow {
  date: string; // Format YYYY-MM-DD
  client: string;
  income: number;
  expenses: number;
  comments: string;
  net: number;
}

export const exportToExcel = async (
  data: (string | number)[][], // Acceptation des données sous forme de tableau de tableaux
  headers: string[], // Ajout des en-têtes comme argument
  fileName: string = 'export.xlsx'
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Financial Data');

  // Ajout des en-têtes
  worksheet.addRow(headers);

  // Ajout des données
  data.forEach(row => {
    worksheet.addRow(row);
  });

  // Génération et téléchargement du fichier
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
