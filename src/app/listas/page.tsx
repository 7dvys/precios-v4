import { Products } from "@/types"
import { Observaciones, Product } from "@/types/Contabilium"
import { inferListas } from "@/utils/listas/inferListas"
import { simpleDataSerializer } from "@/utils/simpleDataSerializer"

const {encoder} = simpleDataSerializer()

const Listas:React.FC = ()=>{

const observaciones:Observaciones = {
    ultActualizacion:new Date().toDateString(),
    cotizacion:'dolar',
    cotizacionPrecio:1000,
    proveedor:'jose juan',
    lista:'jose',
    tagsId:['descuento'],
    descuento:[-10,300],
}

const product = (id:number):Product=>({
    Id:id,
    Nombre:'Nombreprueba',
    Codigo:'Codigoprueba',
    CodigoOem:'CodigoOemprueba',
    CodigoBarras:`${id}`,
    Descripcion:'Descripcionprueba',
    Precio:10,
    PrecioFinal:10,
    Iva:10,
    Rentabilidad:10,
    CostoInterno:10,
    Stock:10,
    StockMinimo:10,
    Observaciones:encoder(observaciones),
    Estado:'Estadoprueba',
    Tipo:'Tipoprueba',
    IdRubro:'IdRubroprueba',
    IdSubrubro:'IdSubrubroprueba',
    Foto:'Fotoprueba',
    AplicaRG5329:false,
    IDMoneda:10,
    ListasDePrecio:{},
    Items:{},
})

const products:Products = {
    main:[product(2)],
    secondary:[product(1),product(3)]
}

console.log({inferedList:inferListas({products})})

return <></>
}


export default Listas;