import { Products } from "@/types/Products";
import { serializeProducts } from "../serializeProducts";
import { TableItem, TableItemIdentifier } from "@/types/TableTypes";
import { ListaItem, Tag, Tags } from "@/types/Listas";
import { getAccountTypeFromSkus } from "../getAccountTypeFromSkus";
import { Product } from "@/types/Contabilium";
import { genCbItemRow, genSheetItemRow } from "./genTableRowLabels";
import { AccountType } from "@/types/Config";

const tagsCoeficient = ({tags,itemTagsId}:{tags:Tags,itemTagsId:string[]})=>{
    let fixedCoeficient = 0;
    let porcentualCoeficientFactor = 1;

    if(!Object.keys(tags).length || !itemTagsId.length)
    return {fixedCoeficient,porcentualCoeficientFactor};
    
    itemTagsId.forEach(tagId=>{
        if(tagId in tags){
            const {fijo,porcentual} = tags[tagId];
            const porcentualFactor = (porcentual/100)+1;
            fixedCoeficient+=fijo;
            porcentualCoeficientFactor*=porcentualFactor;
        }
    })
    return {fixedCoeficient,porcentualCoeficientFactor};
}

export const getTableItemsAndItemsDictionary = ({products,items,tags}:{products:Products,items:ListaItem[],tags:Tags})=>{

    const serializedProducts = serializeProducts({products});
    const itemsDictionary:Record<number,TableItemIdentifier> = {}; 
    
    const addToItemsDictionary = ({codigo,sku,index,account}:TableItemIdentifier & {index:number})=>{
        itemsDictionary[index]={codigo,sku,account}
    }

    let index = 0;
    const tableItems:TableItem[] = items.flatMap(({cbItemSkus,codigo,costo,cotizacion,tagsId,titulo,iva,rentabilidad})=>{
        
        const accountTypeFromSkus = getAccountTypeFromSkus(cbItemSkus)
        
        const {fixedCoeficient,porcentualCoeficientFactor} = tagsCoeficient({tags,itemTagsId:tagsId})
        const rentabilidadFactor = (rentabilidad/100)+1 || 1;
        const ivaFactor = (iva/100)+1 || 1;
        const finalCost = (costo+fixedCoeficient)*porcentualCoeficientFactor*rentabilidadFactor*ivaFactor;
        const {itemLabel,detallesLabel,precioFinalLabel} = genSheetItemRow({
            titulo,
            sheetItemCodigo: codigo,
            accountTypeFromSkus,
            cotizacion,
            tagsId,
            finalCost,
            cost: costo,
            profit: rentabilidad,
            iva,
            fixedCoeficient,
            porcentualCoeficientFactor,
        })

        const sheetItemRow ={
            id:index,
            codigo,titulo,        
            styles:{backgroundColor:'var(--grey-beige-1)'},
            cotizacion,
            cbItemSkus:accountTypeFromSkus,
            tagsId:tagsId.join(',') || 'sin tags',
            item:itemLabel,
            detalles:detallesLabel,
            precioFinal:precioFinalLabel,
        }

        addToItemsDictionary({codigo:codigo,sku:null,index:index++,account:null});

        const cbItemRows = Object.entries(cbItemSkus).flatMap(([account,skus]:[string,string[]])=>            
            skus.flatMap(sku=>{
                const {Nombre:titulo,Stock:stock,PrecioFinal:final,CostoInterno:costo,Iva:iva,Rentabilidad:rentabilidad}:Product = serializedProducts[account as 'main'|'secondary'][sku];

                const {itemLabel,detallesLabel,precioFinalLabel} = genCbItemRow({
                    sheetItemCodigo: codigo,
                    titulo,
                    sku,
                    account:account as AccountType,
                    cbItemFinal: final,
                    cbItemCosto: costo,
                    cbItemRentabilidad: rentabilidad,
                    cbItemIva: iva,
                    cbItemStock: stock,
                })
                
                const cbItemRow ={
                    id:index,
                    codigo,titulo,
                    cotizacion,
                    cbItemSkus:accountTypeFromSkus,
                    tagsId:tagsId.join(',') || 'sin tags',
                    item:itemLabel,
                    detalles:detallesLabel,
                    precioFinal:precioFinalLabel,
                }
                addToItemsDictionary({codigo:codigo,sku,index:index++,account:account as 'main'|'secondary'})
                return cbItemRow;
            })
        )
        return [sheetItemRow,...cbItemRows];
    });

    return {tableItems,itemsDictionary};
}