import { Dispatch, SetStateAction } from "react";
import { Products } from ".";
import { Vendor } from "./Contabilium";
import { Cotizaciones, CotizacionesUtilsDependencies } from "./Cotizaciones";
import { Lista, ListaItem } from "./Listas";
import * as XLSX from 'xlsx';
import { TableGroupFunction } from "./TableTypes";


export type AgregarPageProps = {
    cotizacionesUtilsDependencies:CotizacionesUtilsDependencies
    products:Products;
    vendors:Vendor[];
}

export type ListaFieldsProps = {
    vendors:Vendor[];
    setLista:Dispatch<SetStateAction<Lista>>;
}

export type ItemsFieldsProps = {
    cotizaciones:Cotizaciones;
    products:Products;
    setXlsxWorkbook:Dispatch<SetStateAction<XLSX.WorkBook>>;
    xlsxWorkbook:XLSX.WorkBook;
    setXlsxSheetItems:Dispatch<SetStateAction<ListaItem[]>>;
    xlsxSheetItems:ListaItem[];
    xlsxListaItemsList:XlsxListaItems[];
    setXlsxListaItemsList:Dispatch<SetStateAction<XlsxListaItems[]>>;
}

export type ItemsTableProps = {
    products:Products;
    sheetItems:ListaItem[]
    groupFunctions:TableGroupFunction[]
}

export type XlsxListaItems = {
    fileName:string;
    sheetName:string;
    items:ListaItem[];
}

export type JsonSheet = (number|string)[][]

export type SheetToJsonParams = {
    xlsxWorkbook:XLSX.WorkBook;
    sheetName:string;
}

export type SheetCols = {
    colCod:number|string,
    colTitle:number|string|null,
    colCost:number|string,
    colIva:number|string|null,
    colProfit:number|string|null,
    colExchRate:string|number|null,
    colTags:number|string|null,
}

export type DefaultSheetValues = {
    defaultIva:number;
    defaultProfit:number;
    defaultExchRate:string;
} 

export type FormatedJsonSheetItem = {
    codigo: string;
    titulo: string |null;
    costo: number;
    iva:number | null;
    cotizacion:string | null;
    rentabilidad:number | null;
    tagsId: string[]
}


export type FormatedJsonSheet = FormatedJsonSheetItem[]