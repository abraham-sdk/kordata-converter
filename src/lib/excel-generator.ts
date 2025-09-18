import { ExcelField } from "@/types";
import * as XLSX from "xlsx";
import { z } from "zod";

export const excelConfigSchema = z.object({
  includeConditionalFields: z.boolean().default(true),
  includeLineItems: z.boolean().default(true),
  includeValidationRules: z.boolean().default(false),
  includeDefaultValues: z.boolean().default(false),
  outputFormat: z.enum(["xlsx", "csv"]).default("xlsx"),
  templateStyle: z
    .enum(["standard", "detailed", "client_review"])
    .default("standard"),
});
export type ExcelConfig = z.infer<typeof excelConfigSchema>;


export function generateExcelFile(rows: ExcelField[], config: ExcelConfig): Blob {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Prepare the data for the worksheet
  const worksheetData = [
    ["Form Name", "Page", "Section", "Field Name", "Field Type", "Description / Options"],
    ...rows.map((row) => [
      row.formTitle,
      row.pageTitle,
      row.sectionTitle,
      row.fieldName,
      row.fieldType,
      row.description,
    ]),
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const columnWidths = [
    { wch: 25 }, // Form Name
    { wch: 20 }, // Page
    { wch: 20 }, // Section
    { wch: 30 }, // Field Name
    { wch: 15 }, // Field Type
    { wch: 40 }, // Description
  ];
  worksheet["!cols"] = columnWidths;

  // Style the header row
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "366EF7" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Form Definition");

  // Generate buffer based on output format
  if (config.outputFormat === "csv") {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  } else {
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
}

export function generateDetailedExcelFile(
  rows: ExcelField[],
  config: ExcelConfig,
  formData: any
): Blob {
  const workbook = XLSX.utils.book_new();

  // Main form definition sheet
  const mainSheetData = [
    ["Form Name", "Page", "Section", "Field Name", "Field Type", "Description / Options"],
    ...rows.map((row) => [
      row.formTitle,
      row.pageTitle,
      row.sectionTitle,
      row.fieldName,
      row.fieldType,
      row.description,
    ]),
  ];

  const mainWorksheet = XLSX.utils.aoa_to_sheet(mainSheetData);
  mainWorksheet["!cols"] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Form Definition");

  // Summary sheet
  const summaryData = [
    ["Property", "Value"],
    ["Form Name", formData.name || "Unnamed Form"],
    ["Version", formData.version || "N/A"],
    ["Total Pages", formData.pages?.length || 0],
    ["Total Fields", rows.length],
    ["Has Line Items", formData.lineItems ? "Yes" : "No"],
    ["Generated On", new Date().toLocaleString()],
  ];

  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWorksheet["!cols"] = [{ wch: 20 }, { wch: 30 }];

  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

  // Generate the file
  if (config.outputFormat === "csv") {
    const csvContent = XLSX.utils.sheet_to_csv(mainWorksheet);
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  } else {
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
}
