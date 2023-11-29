import { Lista, ListaItem, Tag } from "@/types/Listas";
import { DecodedObject, simpleDataSerializer } from "../simpleDataSerializer";
import { ObservacionesWithTags } from "@/types/Contabilium";
import { AccountType } from "@/types/Config";
import { inferListasUtils } from "./inferListasUtils";
import { genItemsFromLista } from "./genItemsFromLista";
import { Products } from "@/types/Products";

const {decoder} = simpleDataSerializer()

export const inferListas = ({products}:{products:Products}):Lista[] =>{
    const listas:Lista[] = [];
    const {setLista,getLista,addItemToLista,addCbItemSkuToItemLista,addTagToLista,updateListaType,isSetItemOnLista} = inferListasUtils({listas})
    Object.entries(products).forEach(([account,accountProducts])=>{

        accountProducts.forEach((product)=>{
            const {
                Codigo:sku,
                Observaciones:observaciones,
                Descripcion:codigo,
                Nombre:titulo,
                CodigoBarras,
                Rentabilidad:rentabilidad,
                Iva:iva,
                CostoInterno:costo
            } = product

            const decodedObservaciones = decoder<ObservacionesWithTags>(observaciones) as DecodedObject<ObservacionesWithTags>;

            // if(!('lista' in decodedObservaciones) || !('tagsId' in decodedObservaciones) || !('cotizacion' in decodedObservaciones) || !('proveedor' in decodedObservaciones))
            // return ;      
    
            const {lista:[listaName],tagsId,cotizacion:[cotizacion],proveedor} = decodedObservaciones;

            const vendorId = Number(CodigoBarras) || 0;
            const vendor = proveedor[0] || 'sin proveedor';
            const listaNameOrDefault = listaName || 'sin proveedor';

            const item:ListaItem = {codigo,titulo,tagsId,costo,iva,rentabilidad,cotizacion:cotizacion||'peso',cbItemSkus:{main:[],secondary:[]}};

            item.cbItemSkus[account as 'main'|'secondary'].push(sku);
        
            const lista = getLista({searchName:listaNameOrDefault});

            const inferTags = ():Record<string,Tag> =>{
                return tagsId.reduce((acc,tagId)=>{
                    const tag = (decodedObservaciones)[tagId]

                    if(!tag)
                    return acc;
                
                    const [porcentual,fijo] = tag;
                    acc[tagId] = {descripcion:'',porcentual,fijo};
                    return acc;
                },{} as Record<string,Tag>)
            }
            
            const inferedTags = inferTags()
                        
            if(!lista)
            setLista({
                name:listaNameOrDefault,
                vendor,
                vendorId:vendorId,
                xlsxSheets:[],
                inferedItems:[item],
                items:[item],
                tags:inferedTags,
                type:account as AccountType
            })   

            else{
                const {name,type} = lista;
                const searchListaParams = {searchName:name}
                const isItemOnLista = isSetItemOnLista(searchListaParams,item);

                if(!isItemOnLista)
                addItemToLista(searchListaParams,item);
                else
                addCbItemSkuToItemLista(searchListaParams,item,account as 'main'|'secondary',sku);

                Object.entries(inferedTags).forEach(([tagId,tag])=>{
                    addTagToLista(searchListaParams,{tag,tagId});
                })

                if(type !== account)
                updateListaType(searchListaParams,'both');
            }
        })
    })

    const listasWithItems = listas.map(lista=>{
        lista.items = genItemsFromLista({lista,xlsxSheetItems:[]});
        return lista;
    })
    
    return listasWithItems;
}