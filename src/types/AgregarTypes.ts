import { Dispatch, SetStateAction } from "react";
import { Products } from "./Products";
import { Vendor } from "./Contabilium";
import { Cotizaciones, CotizacionesUtilsDependencies } from "./Cotizaciones";
import { Lista, ListaItem, Tag, Tags } from "./Listas";
import * as XLSX from 'xlsx';
import { AddSheet, AddTag, RemoveListaItem, RemoveListaItemSku, RemoveSheet, RemoveTag, SetNameVendorAndType } from "./UseListasTypes";
import { TableGroupFunction, TableItem } from "./TableTypes";


export type AgregarPageProps = {
    cotizacionesUtilsDependencies:CotizacionesUtilsDependencies
    products:Products;
    vendors:Vendor[];
}

export type ItemsListaEditorProps = {
    lista:Lista;
    cotizaciones:Cotizaciones;
    products:Products;
    removeSheet:RemoveSheet;
    addSheet:AddSheet;
    addTag:AddTag;
    removeTag:RemoveTag;
    removeListaItem:RemoveListaItem;
    removeListaItemSku:RemoveListaItemSku;
    readOnly:boolean;
}  

export type SheetInformation = {fileName:string,sheetName:string};

export type ListaFieldsProps = {
    vendors:Vendor[];
    setNameVendorAndType:SetNameVendorAndType
}

export type ItemsFieldsProps = {
    cotizaciones:Cotizaciones;
    products:Products;
    xlsxSheets:XlsxSheet[];
    xlsxSheet:XlsxSheet;
    setXlsxSheet:Dispatch<SetStateAction<XlsxSheet>>;
    removeSheet:RemoveSheet;
    addSheet:AddSheet;
}

export type ItemsTableProps = {
    tableItems:TableItem[]
    groupFunctions: TableGroupFunction[]|undefined
}

export type XlsxSheet = {
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

export type SerializedFormatedJsonSheet = Record<string, FormatedJsonSheetItem>