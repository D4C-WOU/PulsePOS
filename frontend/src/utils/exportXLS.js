import * as XLSX from "xlsx";

export const exportXLS = ({ title, headers, data, filename = "report.xlsx" }) => {
  // Combine title, metadata, and structured table data
  const worksheetData = [
    [title],
    [`Generated on: ${new Date().toLocaleString()}`],
    [], // Spacer row
    headers,
    ...data,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  
  XLSX.writeFile(workbook, filename);
};

export default exportXLS;
