import { XlsxSheet } from "./AgregarTypes";
import { AccountType } from "./Config";

export type ListaItem = {
    codigo:string;
    titulo:string | null;
    costo:number;
    iva:number;
    rentabilidad:number;
    cotizacion:string;
    tagsId:string[];
    cbItemSkus:{main:string[],secondary:string[]};
}

export type Tag = {
    descripcion:string;
    fijo:number;
    porcentual:number;
}

export type Tags = Record<string,Tag>;

export type Lista = {
    name:string;
    vendor:string;
    vendorId:number;
    tags:Tags;
    xlsxSheets:XlsxSheet[];
    inferedItems:ListaItem[];
    items:ListaItem[];
    type:AccountType|'both';
}

// export type Listas = Record<string,Lista>;
export type SerializedItemsFromLista = Record<string,ListaItem>;

export type DbLista = Lista&{id:number}


