import { XlsxSheet } from "@/types/AgregarTypes";

export const serializeXlsxSheets = (xlsxSheets:XlsxSheet[])=>{
    return xlsxSheets.reduce((acc,xlsxSheet)=>{
        acc[xlsxSheet.fileName+xlsxSheet.sheetName] = xlsxSheet
        return acc;
    },{} as Record<string,XlsxSheet>)
}