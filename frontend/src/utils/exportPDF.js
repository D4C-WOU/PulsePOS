import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = ({ title, headers, data, filename = "report.pdf" }) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(13, 31, 22); // Dark Green (#0D1F16)
  doc.text(title, 14, 22);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Table
  autoTable(doc, {
    startY: 35,
    head: [headers],
    body: data,
    theme: "grid",
    headStyles: { fillColor: [19, 42, 30], textColor: [254, 250, 224] }, // `#132A1E` head and beige text
    alternateRowStyles: { fillColor: [254, 250, 224, 0.2] }, // Light beige background tint
    margin: { top: 35 },
  });

  doc.save(filename);
};

export default exportPDF;
