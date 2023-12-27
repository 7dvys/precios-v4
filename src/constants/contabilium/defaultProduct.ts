import { Product } from "@/types/Contabilium";

export const defaultProduct:Product = {
    AplicaRG5329: false,
    Codigo: "",
    CodigoBarras: "",
    CodigoOem: "",
    CostoInterno: 0,
    Descripcion: "",
    Estado: "A",
    Foto: '',
    IDMoneda: 0,
    Id: 0,
    IdRubro: "",
    IdSubrubro: "",
    Items: null,
    Iva: 21,
    ListasDePrecio: null,
    Nombre: "",
    Observaciones: "",
    Precio: 0,
    PrecioFinal: 0,
    Rentabilidad: 0,
    Stock: 0,
    StockMinimo: 0,
    Tipo: "P"
}

export const defaultCreateProduct = {
    Nombre: "",
    Tipo:'P', 
    Codigo:'', 
    Precio:0, 
    Iva:21, 
    Estado:'A', 
    IDRubro:""
}