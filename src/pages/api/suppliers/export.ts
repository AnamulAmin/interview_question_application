import type { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";
import { Parser } from "json2csv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { suppliers } = req.body;
    const format = req.query.format as string;

    switch (format.toUpperCase()) {
      case "CSV":
        return exportCSV(res, suppliers);
      case "EXCEL":
        return exportExcel(res, suppliers);
      case "PDF":
        return exportPDF(res, suppliers);
      default:
        return res.status(400).json({ message: "Invalid format" });
    }
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ message: "Export failed" });
  }
}

function exportCSV(res: NextApiResponse, suppliers: any[]) {
  const fields = [
    { label: "Supplier Name", value: "supplierName" },
    { label: "Email Address", value: "email" },
    { label: "Mobile Number", value: "mobile" },
    { label: "Previous Credit Balance", value: "previousCreditBalance" },
    { label: "Address", value: "address" },
  ];

  const json2csvParser = new Parser({
    fields,
    delimiter: ",",
    quote: '"',
  });

  const csv = json2csvParser.parse(suppliers);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=suppliers.csv");
  return res.status(200).send(csv);
}

function exportExcel(res: NextApiResponse, suppliers: any[]) {
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(suppliers);

  // Set column widths
  const colWidths = [
    { wch: 30 }, // supplierName
    { wch: 35 }, // email
    { wch: 15 }, // mobile
    { wch: 20 }, // previousCreditBalance
    { wch: 40 }, // address
  ];
  worksheet["!cols"] = colWidths;

  // Add headers with styling
  const headers = [
    "Supplier Name",
    "Email",
    "Mobile",
    "Previous Credit Balance",
    "Address",
  ];
  const headerRow = XLSX.utils.aoa_to_sheet([headers]);
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=suppliers.xlsx");
  return res.status(200).send(buffer);
}

async function exportPDF(res: NextApiResponse, suppliers: any[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height, width } = page.getSize();

  let yOffset = height - 50;
  const lineHeight = 25;

  // Add title
  page.drawText("Suppliers List", {
    x: 50,
    y: yOffset,
    size: 20,
    color: rgb(0, 0, 0),
  });
  yOffset -= lineHeight * 2;

  // Add supplier data
  suppliers.forEach((supplier) => {
    // Draw a light background for each supplier
    page.drawRectangle({
      x: 45,
      y: yOffset - 80, // Height for all supplier info
      width: width - 90,
      height: 85,
      color: rgb(0.95, 0.95, 0.95),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });

    page.drawText(`Name: ${supplier.supplierName || "N/A"}`, {
      x: 50,
      y: yOffset,
      size: 12,
    });
    yOffset -= lineHeight;

    page.drawText(`Email: ${supplier.email || "N/A"}`, {
      x: 50,
      y: yOffset,
      size: 12,
    });
    yOffset -= lineHeight;

    page.drawText(`Mobile: ${supplier.mobile || "N/A"}`, {
      x: 50,
      y: yOffset,
      size: 12,
    });
    yOffset -= lineHeight;

    page.drawText(`Credit Balance: ${supplier.previousCreditBalance || "0"}`, {
      x: 50,
      y: yOffset,
      size: 12,
    });
    yOffset -= lineHeight;

    // Add some spacing between suppliers
    yOffset -= lineHeight;

    // Add new page if needed
    if (yOffset < 100) {
      page = pdfDoc.addPage();
      yOffset = height - 50;
    }
  });

  const pdfBytes = await pdfDoc.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=suppliers.pdf");
  return res.status(200).send(Buffer.from(pdfBytes));
}
