import { Products } from "@/types/Products";
import { serializeProducts } from "../serializeProducts";
import { ItemsDictionary, TableItem, TableItemIdentifier } from "@/types/TableTypes";
import { ListaItem, Tag, Tags } from "@/types/Listas";
import { getAccountTypeFromSkus } from "../getAccountTypeFromSkus";
import { Product, RubrosWithSubRubrosPerAccount } from "@/types/Contabilium";
import { genCbItemRow, genSheetItemRow } from "./genTableRowLabels";
import { AccountType } from "@/types/Config";
import { getTagsCoeficients } from "./getTagsCoeficients";

export const getTableItemsAndItemsDictionary = ({products,items,tags,rubrosWithSubRubros}:{products:Products,items:ListaItem[],tags:Tags,rubrosWithSubRubros:RubrosWithSubRubrosPerAccount})=>{
    const serializedProducts = serializeProducts({products});
    const itemsDictionary:ItemsDictionary = {}; 
    
    const addToItemsDictionary = ({codigo,sku,index,account}:TableItemIdentifier & {index:number})=>{
        itemsDictionary[index]={codigo,sku,account}
    }

    let index = 0;
    const tableItems:TableItem[] = items.flatMap(({cbItemSkus,codigo,costo,cotizacion,tagsId,titulo,iva,rentabilidad})=>{
        
        const accountTypeFromSkus = getAccountTypeFromSkus(cbItemSkus);
        
        const {fixedCoeficient,porcentualCoeficientFactor} = getTagsCoeficients({tags,itemTagsId:tagsId});
        const rentabilidadFactor = (rentabilidad/100)+1 || 1;
        const ivaFactor = (iva/100)+1 || 1;
        const finalCost = (costo+fixedCoeficient)*porcentualCoeficientFactor*rentabilidadFactor*ivaFactor;

        const sheetItemRow ={
            id:index,
            codigo,
            titulo,
            styles:{backgroundColor:'var(--grey-beige-1)'},
            cotizacion,
            cbItemSkus:accountTypeFromSkus,
            tagsId:tagsId.join(',') || 'sin tags',
            cbTitulos:[] as string[],
            rubro:[] as string [],
            subRubro:[] as string[],
        }

        addToItemsDictionary({codigo:codigo,sku:null,index:index++,account:null});

        const cbItemRows = Object.entries(cbItemSkus).flatMap(([account,skus]:[string,string[]])=>            
            skus.flatMap(sku=>{
                if(!(sku in serializedProducts[account as AccountType]))
                return null;
                
                const {
                    Nombre:titulo,
                    Stock:stock,
                    PrecioFinal:final,
                    CostoInterno:costo,
                    Iva:iva,
                    Rentabilidad:rentabilidad,
                    Observaciones:observaciones,
                    IdRubro:cbIdRubro,
                    IdSubrubro:cbSubRubro
                }:Product = serializedProducts[account as AccountType][sku];

                const rubro = rubrosWithSubRubros[(account as AccountType)].find(({Id})=>Id===Number(cbIdRubro));
                const subRubro = rubro?.SubRubros.find(({Id})=>Id===Number(cbSubRubro))

                const {itemLabel,detallesLabel,precioFinalLabel} = genCbItemRow({
                    sheetItemCodigo: codigo,    
                    titulo,
                    sku,
                    account:account as AccountType,
                    cbItemFinal: Number(final.toFixed(2)),
                    cbItemCosto: Number(costo.toFixed(2)),
                    cbItemRentabilidad: rentabilidad,
                    cbItemIva: iva,
                    cbItemStock: stock,
                    cbItemObservaciones:observaciones,
                    rubro:rubro?.Nombre || 'sin rubro',
                    subRubro:subRubro?.Nombre || 'sin subrubro'
                })
                
                const cbItemRow ={
                    id:index,
                    codigo,titulo,
                    cotizacion,
                    cbItemSkus:accountTypeFromSkus,
                    tagsId:tagsId.join(',') || 'sin tags',
                    rubro:rubro?.Nombre || 'sin rubro',
                    subRubro:subRubro?.Nombre || 'sin subrubro',
                    item:itemLabel,
                    detalles:detallesLabel,
                    precioFinal:precioFinalLabel,
                    cbTitulos:titulo,
                }

                addToItemsDictionary({codigo:codigo,sku,index:index++,account:account as AccountType})

                sheetItemRow.rubro.push(rubro?.Nombre || 'sin rubro')
                sheetItemRow.subRubro.push(subRubro?.Nombre || 'sin subrubro')
                sheetItemRow.cbTitulos.push(titulo);
                
                return cbItemRow;
            })
        ).filter((product)=>product !== null) as TableItem[];

        const {itemLabel,detallesLabel,precioFinalLabel} = genSheetItemRow({
            titulo,
            sheetItemCodigo: codigo,
            accountTypeFromSkus,
            cotizacion,
            tagsId,
            finalCost,
            cost: Number(costo.toFixed(2)),
            profit: rentabilidad,
            iva,
            fixedCoeficient,
            porcentualCoeficientFactor,
        });

        const sheetItemRowFormated = {...sheetItemRow,
            item:itemLabel,
            detalles:detallesLabel,
            precioFinal:precioFinalLabel,
            rubro:sheetItemRow.rubro.length === 0 ?['sin rubro']:sheetItemRow.rubro,
            subRubro:sheetItemRow.subRubro.length === 0 ?['sin subrubro']:sheetItemRow.subRubro,
        }      
        
        return [sheetItemRowFormated,...cbItemRows];
    });

    return {tableItems,itemsDictionary};
}