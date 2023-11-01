import { Products } from "@/types";
import { Lista, ListaItem, Tag } from "@/types/Listas";
import { simpleDataSerializer } from "../simpleDataSerializer";
import { Observaciones, ObservacionesWithTags } from "@/types/Contabilium";
import { AccountType } from "@/types/Config";
import { listasUtils } from "./listasUtils";
import { observacionesHasLista } from "./observacionesHasLista";

const {decoder} = simpleDataSerializer()

export const inferListas = ({products}:{products:Products}):Lista[]=>{
    const listas:Lista[] = [];
    const {setLista,getLista,addItemToLista,addTagToLista} = listasUtils({listas})

    Object.entries(products).forEach(([account,accountProducts])=>{
        accountProducts.forEach((product)=>{
            const {
                Observaciones:observaciones,
                Descripcion:codigo,
                Nombre:titulo,
                CodigoBarras:proveedorId,
                Rentabilidad:rentabilidad,
                Iva:iva,
                CostoInterno:costo
            } = product

            const observacionesListaValues = observacionesHasLista(observaciones)

            if(!observacionesListaValues){
                console.log('faltan datos',observacionesListaValues)
                return;
            }

            const decodedObservaciones = decoder<Observaciones>(observaciones)

            const {tagsId,cotizacion,listaTitulo} = observacionesListaValues;

            const item:ListaItem = {codigo,titulo,tagsId,costo,iva,rentabilidad,cotizacion};
        
            const isSetLista = getLista({searchTitulo:listaTitulo,searchProveedorId:Number(proveedorId)});

            const inferTags = ():Tag[]=>{
                return tagsId.reduce((acc,tagId)=>{
                    const tag = (decodedObservaciones as ObservacionesWithTags)[tagId]

                    if(!tag)
                    return acc;
                
                    const [porcentual,fijo] = tag;
                    const newTag:Tag = {id:tagId,descripcion:'',porcentual,fijo};
                    acc.push(newTag)
                    return acc;
                },[] as Tag[])
            }
            
            const inferedTags = inferTags()
            
            if(!isSetLista)
            setLista({titulo:listaTitulo,proveedorId:Number(proveedorId),items:[item],tags:inferedTags,type:account as AccountType})   
        
            else{
                const {titulo,proveedorId} = isSetLista;
                const searchListaParams = {searchProveedorId:proveedorId,searchTitulo:titulo}
                addItemToLista(searchListaParams,item);
                inferedTags.forEach(tag=>{
                    addTagToLista(searchListaParams,tag);
                })
            }
        })
    })

    return listas;
}