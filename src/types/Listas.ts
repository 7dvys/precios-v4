export type ListaItem = {
    codigo:string;
    titulo:string;
    costo:number;
    iva:number;
    rentabilidad:number;
    cotizacion:string;
    tagsId:string[];
}

export type Tag = {
    id:string;
    descripcion:string;
    fijo:number;
    porcentual:number;
}

export type Lista = {
    id?:number;
    titulo:string;
    proveedorId:number;
    tags:Tag[];
    items:ListaItem[];
    type:'main'|'secondary'|'both';
}