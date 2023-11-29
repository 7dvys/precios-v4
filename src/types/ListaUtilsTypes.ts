import { DefaultSheetValues, SheetCols, SheetToJsonParams, XlsxSheet } from "./AgregarTypes";
import { Products } from "./Products";

export type GetXlsxSheetFromSheetItemsInProductsParams = {
    products:Products,
    overWrite:boolean,
    xlsxSheets:XlsxSheet[]
} & SheetCols & SheetToJsonParams & DefaultSheetValues;