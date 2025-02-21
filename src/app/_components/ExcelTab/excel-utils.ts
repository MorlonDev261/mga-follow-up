import ExcelJS from 'exceljs';

interface FinancialDataRow {
  date: string; // Format YYYY-MM-DD
  client: string;
  income: number;
  expenses: number;
  comments: string;
  net: number;
}

export const exportToExcel = (data: any[], fileName: string = 'export.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Financial Data');

  worksheet.columns = [
    { header: 'Date', key: 'date' },
    { header: 'Client', key: 'client' },
    { header: 'Income (AR)', key: 'income' },
    { header: 'Expenses (AR)', key: 'expenses' },
    { header: 'Comments', key: 'comments' },
    { header: 'Net Available (AR)', key: 'net' }
  ];

  data.forEach(row => {
    worksheet.addRow({
      date: row[0],
      client: row[1],
      income: row[2],
      expenses: row[3],
      comments: row[4],
      net: row[5]
    });
  });

  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  });
};
