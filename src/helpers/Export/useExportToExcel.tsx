import { saveAs } from "@types/file-saver";
import * as XLSX from "xlsx";

interface UseExportToExcelProps {
  data: any[];
}

function useExportToExcel({ data }: UseExportToExcelProps) {
  const exportToExcel = (): void => {
    const worksheet: any = XLSX.utils.json_to_sheet(data);
    const workbook: any = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet");

    // Buffer to store the generated Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob: any = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "MultigymPremium.xlsx");
  };

  return exportToExcel;
}

export default useExportToExcel;
