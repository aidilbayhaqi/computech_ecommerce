import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, filename = "payments.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(dataBlob, filename);
};
