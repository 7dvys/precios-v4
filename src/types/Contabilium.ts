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
    AplicaRG5329:string;
    IDMoneda:number;
    ListasDePrecio:string;
    Items:string;
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