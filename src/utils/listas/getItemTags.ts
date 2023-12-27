import { Observaciones, ObservacionesWithTags } from "@/types/Contabilium";
import { DecodedObject } from "../simpleDataSerializer";
import { Tag, Tags } from "@/types/Listas";

export const getItemTags = ({decodedObservaciones}:{decodedObservaciones:DecodedObject<ObservacionesWithTags>})=>{
    const tagsId = decodedObservaciones.tagsId;

    const tags = tagsId.reduce((acc,tagId)=>{
        if(!(tagId in decodedObservaciones))
        return acc;

        const [porcentual,fijo] = decodedObservaciones[tagId]
        const tag:Tag = {porcentual,fijo,descripcion:''}
        acc[tagId] = tag;
        return acc;

    },{} as Tags)

    return tags;
}