import { Dispatch, SetStateAction } from "react";
import { Products, SerializedProducts } from "./Products";
import { Product, RubrosWithSubRubrosPerAccount, Tokens, Vendor } from "./Contabilium";
import { Cotizaciones } from "./Cotizaciones";
import { Lista, ListaItem, Tag, Tags } from "./Listas";
import * as XLSX from 'xlsx';
import { AddListaItemSku, AddSheet, AddTag, RemoveListaItem, RemoveListaItemSku, RemoveSheet, RemoveTag, SetNameVendorAndType, UpdateListaItem } from "./UseListasTypes";
import { ItemsDictionary, TableGroupFunction, TableItem } from "./TableTypes";
import { AccountType } from "./Config";


export type AgregarPageProps = {
    tokens:Tokens;
    products:Products;
    vendors:Vendor[];
    rubrosWithSubRubros:RubrosWithSubRubrosPerAccount;
}

export type ItemsListaEditorProps = {
    lista:Lista;
    removeSheet:RemoveSheet;
    addSheet:AddSheet;
    addTag:AddTag;
    removeTag:RemoveTag;
    removeListaItem:RemoveListaItem;
    updateListaItem:UpdateListaItem;
    removeListaItemSku:RemoveListaItemSku;
    addListaItemSku:AddListaItemSku;
    saveLista:()=>void;

    readOnly:boolean;
}  

export type SheetInformation = {fileName:string,sheetName:string};

export type ListaFieldsProps = {
    vendors:Vendor[];
    lista:Lista;
    setNameVendorAndType:SetNameVendorAndType
}

export type ItemsFieldsProps = {
    cotizaciones:Cotizaciones;
    products:Products;
    xlsxSheets:XlsxSheet[];
    tmpXlsxSheet:XlsxSheet
    addTmpXlsxSheetToLista:()=>void;
    setTmpXlsxSheet:Dispatch<SetStateAction<XlsxSheet>>
    removeTmpXlsxSheet:()=>void;
    removeSheet:RemoveSheet;
    finishListaFunc:()=>void;
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

export type ItemEditorProps = {
    clearTableItemIdToEditSkuList:()=>void;
    serializedProducts:SerializedProducts;
    serializedListaItems:Record<string,ListaItem>;
    cotizaciones:Cotizaciones;
    tags:Tags
    fixedProducts:Products;
    listaItemsAndTmpXlsxSheetItems:ListaItem[];
    rubrosWithSubRubros:RubrosWithSubRubrosPerAccount;
    itemsDictionary:ItemsDictionary;
    tableItemIdToEditSkuList: number[]
    tokens:Tokens;
    removeTableItemIdToEditSkuList: (id: number) => void
    removeItemSku:RemoveListaItemSku
    updateListaItem:UpdateListaItem;
    addItemSku:AddListaItemSku
    getCbItemByCodigo:({account,codigo}:{account:AccountType,codigo:string})=>Promise<Product|{error:string}>
    createItemSku:(params:{product:Product,account:AccountType,codigo:string})=>void;
}


export type FormatedJsonSheet = FormatedJsonSheetItem[]

export type SerializedFormatedJsonSheet = Record<string, FormatedJsonSheetItem>