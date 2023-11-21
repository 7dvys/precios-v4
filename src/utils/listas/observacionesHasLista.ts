import { ObservacionesWithTags } from "@/types/Contabilium";
import { simpleDataSerializer } from "../simpleDataSerializer";

const {decoder} = simpleDataSerializer();

export const observacionesHasLista = (observaciones:string)=>{
    if(!observaciones)
    return false;

    const decodedObservaciones = decoder<ObservacionesWithTags>(observaciones);

    if(!('lista' in decodedObservaciones) || !('tagsId' in decodedObservaciones) || !('cotizacion' in decodedObservaciones) || !('proveedor' in decodedObservaciones))
    return false;    

    return true;
}