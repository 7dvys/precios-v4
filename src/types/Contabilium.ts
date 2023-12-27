import { AccountType } from "./Config";

export type CbUserKey = 'userMain'|'userSecondary';
export type CbPassKey = 'passMain'|'passSecondary';
export type CbTokenKey = 'tokenMain'|'tokenSecondary';
export type CbCredentials = {[key in CbUserKey|CbPassKey]:string}

export type CbToken = {
    access_token:string;
    token_type:'bearer';
    expires_in:number; // time in sec (24 hours)
    error?:string
}

export type ObservacionesWithTags = ObservacionesWithoutTags & {
    [tag:string]:[porcentual:number,fijo:number]
}

export type ObservacionesWithoutTags = {
    ultActualizacion: string;
    cotizacion: string;
    cotizacionPrecio: number;
    costoCotizacion:number;
    costoLista:number;
    enlazadoMl:'si'|'sin revisar';
    proveedor: string;
    lista:string;
    tagsId:string[];
}

export type Observaciones = ObservacionesWithTags | ObservacionesWithoutTags;

export type Product = {
    Id:number;
    Nombre:string;
    Codigo:string;
    CodigoOem:string;
    CodigoBarras:string;
    Descripcion:string;
    Precio:number;
    PrecioFinal:number;
    Iva:number;
    Rentabilidad:number;
    CostoInterno:number;
    Stock:number;
    StockMinimo:number;
    Observaciones:string;
    Estado:string;
    Tipo:string;
    IdRubro:string;
    IdSubrubro:string;
    Foto:string;
    AplicaRG5329:boolean;
    IDMoneda:number;
    ListasDePrecio:{}|null;
    Items:{}|null;
}


export type Vendor = {
    Ciudad: string;
    Codigo: string;
    CondicionIva: string;
    Cp: string;
    Domicilio: string;
    Email: string;
    Id: number;
    IdCiudad: number;
    IdListaPrecio: number;
    IdPais: number;
    IdProvincia: number;
    IdUsuarioAdicional: number;
    NombreFantasia: string;
    NroDoc: string;
    Observaciones: string;
    Pais: string;
    Personeria: string;
    PisoDepto: string;
    Provincia: string;
    RazonSocial: string;
    Telefono: string;
    TipoDoc: string;
}

export type UpdatesStatus = {
    id:number,
    status:boolean
}

export type SubRubro = {
    Id:number,
    Nombre:string
}

export type SubRubros = SubRubro[];

export type RubroWithSubRubros = {
    Id:number,
    Nombre:string,
    SubRubros:SubRubros
}

export type RubrosWithSubRubros = RubroWithSubRubros[];

export type RubrosWithSubRubrosPerAccount = {[key in AccountType]:RubrosWithSubRubros}

export type Tokens = {
    main: string;
    secondary: string;
}
