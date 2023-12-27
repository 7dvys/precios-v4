import { DefaultSheetValues, SheetCols, SheetToJsonParams, XlsxSheet } from "./AgregarTypes";
import { Products } from "./Products";

export type GetXlsxSheetFromSheetItemsInProductsParams = {
    products:Products,
    overWrite:boolean,
    addNewItems:boolean,
    xlsxSheets:XlsxSheet[]
} & SheetCols & SheetToJsonParams & DefaultSheetValues;