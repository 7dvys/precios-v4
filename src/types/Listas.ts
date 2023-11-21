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
    id:string;
    descripcion:string;
    fijo:number;
    porcentual:number;
}

export type Lista = {
    id:number;
    titulo:string;
    proveedor:string;
    proveedorId:number;
    tags:Tag[];
    items:ListaItem[];
    type:'main'|'secondary'|'both';
}



export type InferedLista = Omit<Lista,'id'|'items'>;