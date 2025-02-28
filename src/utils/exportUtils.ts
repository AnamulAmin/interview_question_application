import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportUtils = {
  copyToClipboard: async (data: any[]) => {
    const formattedData = data
      .map((item) => Object.values(item).join("\t"))
      .join("\n");
    await navigator.clipboard.writeText(formattedData);
  },

  exportToCSV: (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  },

  exportToExcel: (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  },

  exportToPDF: (data: any[], filename: string) => {
    const doc = new jsPDF();
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => Object.values(row));

    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 15 }, // SL No
        1: { cellWidth: 30 }, // Name
        2: { cellWidth: 25 }, // Leave Type
        3: { cellWidth: 25 }, // Application Start Date
        4: { cellWidth: 25 }, // Application End date
        5: { cellWidth: 25 }, // Approve Start Date
        6: { cellWidth: 25 }, // Approved End Date
        7: { cellWidth: 15 }, // Days
        8: { cellWidth: 15 }, // Approved Day
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
    });

    doc.save(`${filename}.pdf`);
  },

  print: (data: any[]) => {
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => Object.values(row));

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Print</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #2980b9; color: white; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row) => `
                <tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  },
};
