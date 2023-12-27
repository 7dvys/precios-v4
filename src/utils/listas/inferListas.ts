import { Lista, ListaItem, Tag } from "@/types/Listas";
import { DecodedObject, simpleDataSerializer } from "../simpleDataSerializer";
import { ObservacionesWithTags, Product } from "@/types/Contabilium";
import { AccountType } from "@/types/Config";
import { inferListasUtils } from "./inferListasUtils";
import { Products } from "@/types/Products";
import { genItemsFromInferedLista } from "./genItemsFromInferdLista";
import { getItemTags } from "./getItemTags";
import { getTagsCoeficients } from "../itemsListaEditor/getTagsCoeficients";
import { XlsxSheet } from "@/types/AgregarTypes";

const {decoder} = simpleDataSerializer()

export const inferListas = ({products}:{products:Products}):Lista[] =>{
    const listas:Lista[] = [];
    const {setLista,getLista,addItemToLista,updateItemExchRate,addCbItemSkuToItemLista,addTagToLista,updateListaType,isSetItemOnLista} = inferListasUtils({listas});

    (Object.entries(products) as [AccountType,Product[]][]).forEach(([account,accountProducts]) =>
        accountProducts.forEach((product)=>{
            const {
                Codigo:sku,
                Observaciones:observaciones,
                Descripcion:codigo,
                Nombre:titulo,
                CodigoBarras,
                Rentabilidad:rentabilidad,
                Iva:iva,
                // CostoInterno:costo,
            } = product

            const decodedObservaciones = decoder<ObservacionesWithTags>(observaciones) as DecodedObject<ObservacionesWithTags>;     
    
            const {
                lista:[listaName],
                tagsId,
                cotizacion:[cotizacion],
                proveedor:[proveedor],
                costoLista:[costo],
            } = decodedObservaciones;



            const vendorId = isNaN(Number(CodigoBarras))?0:Number(CodigoBarras);
            const vendor = proveedor || 'sin proveedor';
            const listaNameOrDefault = listaName || 'sin proveedor';
            
            const inferedTags = getItemTags({decodedObservaciones})

            const item:ListaItem = {codigo,titulo,tagsId,costo:Number(costo),iva,rentabilidad,cotizacion:cotizacion||'peso',cbItemSkus:{main:[],secondary:[]}};

            item.cbItemSkus[account].push(sku);
        
            const lista = getLista({searchName:listaNameOrDefault});

                        
            if(!lista)
            return setLista({
                name:listaNameOrDefault,
                vendor,
                vendorId:vendorId,
                xlsxSheets:[],
                inferedItems:[item],
                items:[],
                tags:inferedTags,
                type:account as AccountType
            })   
            
            const {name,type} = lista;
            const searchListaParams = {searchName:name}
            const isItemOnLista = isSetItemOnLista(searchListaParams,item);

            Object.entries(inferedTags).forEach(([tagId,tag])=>{
                addTagToLista(searchListaParams,{tag,tagId});
            })

            if(type !== account)
            updateListaType(searchListaParams,'both');

            if(!isItemOnLista)
            return addItemToLista(searchListaParams,item);
            
            addCbItemSkuToItemLista(searchListaParams,item,account,sku);
            updateItemExchRate(searchListaParams,item,cotizacion);
        })
    )

    const listasWithItems = listas.map(lista=>{
        const inferedItems = genItemsFromInferedLista({lista})
        const inferedXlsxSheet:XlsxSheet = {fileName:'items inferidos',sheetName:'items inferidos',items:inferedItems}
        lista.items = inferedItems;
        lista.xlsxSheets = [inferedXlsxSheet];

        return lista;
    })
    
    return listasWithItems;
}