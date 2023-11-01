import { Observaciones } from "@/types/Contabilium";
import { simpleDataSerializer } from "../simpleDataSerializer";

const {decoder} = simpleDataSerializer()

export const observacionesHasLista = (observaciones:string)=>{
    const isSetObservaciones = observaciones;

    if(!isSetObservaciones)
    return false;

    const decodedObservaciones = decoder<Observaciones>(observaciones);

    if(!('lista' in decodedObservaciones) || !('tagsId' in decodedObservaciones) || !('cotizacion' in decodedObservaciones))
    return false;            

    const {lista:[listaTitulo],tagsId,cotizacion:[cotizacion]} = decodedObservaciones;


    const trimedListaTitulo = listaTitulo.trim()

    if(trimedListaTitulo)
    return {listaTitulo,tagsId,cotizacion};
}