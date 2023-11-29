import * as XLSX from 'xlsx';
import { JsonSheet, SheetToJsonParams } from "@/types/AgregarTypes";

export const sheetToJson = ({xlsxWorkbook,sheetName}:SheetToJsonParams):JsonSheet => {
    const xlsxWorkbookSheet = xlsxWorkbook.Sheets[sheetName];
    const sheetToJson=XLSX.utils.sheet_to_json(xlsxWorkbookSheet,{header:1,defval:null}) as JsonSheet;
    return sheetToJson;
}