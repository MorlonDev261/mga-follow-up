import ExcelJS from 'exceljs';

interface FinancialDataRow {
  date: string;
  client?: string;
  income?: number;
  expenses?: number;
  comments?: string;
  net: number;
}

export const exportToExcel = async (
  exportData: FinancialDataRow[], 
  headers: string[], 
  fileName: string = 'export.xlsx'
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Financial Data');

  // Ajout des en-têtes
  worksheet.addRow(headers);

  // Ajout des données sous forme de tableau
  exportData.forEach(row => {
    worksheet.addRow([
      row.date,
      row.client || '',
      row.income ?? 0,
      row.expenses ?? 0,
      row.comments || '',
      row.net
    ]);
  });

  // Ajustement automatique de la largeur des colonnes
  worksheet.columns = headers.map((header, colIndex) => {
    const columnData = [
      header, // Inclut l'en-tête dans le calcul
      ...exportData.map(row => {
        const value = Object.values(row)[colIndex];
        return value ? value.toString() : '';
      }),
    ];

    const maxLength = columnData.reduce((max, curr) => Math.max(max, curr.length), 10);
    
    return { width: maxLength + 2 }; // +2 pour un peu d'espace supplémentaire
  });

  // Génération et téléchargement du fichier
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
