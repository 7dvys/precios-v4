import { ObservacionesWithoutTags } from "@/types/Contabilium"
import { simpleDataSerializer } from "./simpleDataSerializer"

export const decodeObservaciones = (observaciones:string)=>{
    const {decoder} = simpleDataSerializer()
    const decodedObservaciones = decoder<ObservacionesWithoutTags>(observaciones)

    if(
        !('lista' in decodedObservaciones) || 
        !('tagsId' in decodedObservaciones) || 
        !('cotizacion' in decodedObservaciones) || 
        !('proveedor' in decodedObservaciones) ||
        !('cotizacionPrecio' in decodedObservaciones) ||
        !('costoLista' in decodedObservaciones) ||
        !('costoCotizacion' in decodedObservaciones) ||
        !('enlazadoMl' in decodedObservaciones)        
    )
    
    return null;  

    return decodedObservaciones;
}