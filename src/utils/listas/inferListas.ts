import { Products } from "@/types";
import { Lista, ListaItem, Tag } from "@/types/Listas";
import { simpleDataSerializer } from "../simpleDataSerializer";
import { ObservacionesWithTags, Product } from "@/types/Contabilium";
import { AccountType } from "@/types/Config";
import { inferListasUtils } from "./inferListasUtils";

const {decoder} = simpleDataSerializer()

export const inferListas = ({products}:{products:Products}):Lista[]=>{
    const listas:Lista[] = [];
    const {setLista,getLista,addItemToLista,addCbItemSkuToItemLista,addTagToLista,updateListaType,isSetItemOnLista} = inferListasUtils({listas})

    Object.entries(products ).forEach(([account,accountProducts])=>{
        accountProducts.forEach((product)=>{
            const {
                Codigo:sku,
                Observaciones:observaciones,
                Descripcion:codigo,
                Nombre:titulo,
                CodigoBarras:proveedorId,
                Rentabilidad:rentabilidad,
                Iva:iva,
                CostoInterno:costo
            } = product

            if(!observaciones)
            return false;

            const decodedObservaciones = decoder<ObservacionesWithTags>(observaciones);

            if(!('lista' in decodedObservaciones) || !('tagsId' in decodedObservaciones) || !('cotizacion' in decodedObservaciones) || !('proveedor' in decodedObservaciones))
            return ;      
    
            const {lista:[listaTitulo],tagsId,cotizacion:[cotizacion],proveedor:[proveedor]} = decodedObservaciones;

            const item:ListaItem = {codigo,titulo,tagsId,costo,iva,rentabilidad,cotizacion:cotizacion||'peso',cbItemSkus:{main:[],secondary:[]}};

            item.cbItemSkus[account as 'main'|'secondary'].push(sku);
        
            const lista = getLista({searchTitulo:listaTitulo,searchProveedorId:Number(proveedorId)});

            const inferTags = ():Tag[]=>{
                return tagsId.reduce((acc,tagId)=>{
                    const tag = (decodedObservaciones)[tagId]

                    if(!tag)
                    return acc;
                
                    const [porcentual,fijo] = tag;
                    const newTag:Tag = {id:tagId,descripcion:'',porcentual,fijo};
                    acc.push(newTag)
                    return acc;
                },[] as Tag[])
            }
            
            const inferedTags = inferTags()
            
            if(!lista)
            setLista({titulo:listaTitulo,proveedor,proveedorId:Number(proveedorId),items:[item],tags:inferedTags,type:account as AccountType} as Lista)   
        
            else{
                const {titulo,proveedorId,type} = lista;
                const searchListaParams = {searchProveedorId:proveedorId,searchTitulo:titulo}
                const isItemOnLista = isSetItemOnLista(searchListaParams,item);

                if(!isItemOnLista)
                addItemToLista(searchListaParams,item);
                else
                addCbItemSkuToItemLista(searchListaParams,item,account as 'main'|'secondary',sku);

                inferedTags.forEach(tag=>{
                    addTagToLista(searchListaParams,tag);
                })

                if(type !== account)
                updateListaType(searchListaParams,'both');
            }
        })
    })

    return listas;
}