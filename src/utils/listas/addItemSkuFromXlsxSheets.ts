import { XlsxSheet } from "@/types/AgregarTypes";
import { AccountType } from "@/types/Config";
import { ListaItem } from "@/types/Listas";

export const addItemSkuFromXlsxSheets = ({xlsxSheets,codigo,account,newSku}:{xlsxSheets:XlsxSheet[],codigo:string,account:AccountType,newSku:string})=>{
    const newXlsxSheets = xlsxSheets.map(xlsxSheet=>{
        const {items} = xlsxSheet;
        const newItems = items.map(item=>{
            const skuAlreadyExist = item.cbItemSkus[account].some(itemSku=>itemSku===newSku)
            
            if(codigo !== item.codigo || skuAlreadyExist)
            return item;

            const newAccountCbItemsSkus = [...item.cbItemSkus[account],newSku]
            const newCbItemSkus = {...item.cbItemSkus,[account]:newAccountCbItemsSkus};
            const newItem:ListaItem = {...item,cbItemSkus:newCbItemSkus}
            return newItem;

        })

        const newXlsxSheet = {...xlsxSheet,items:newItems}
        return newXlsxSheet
    })
    return newXlsxSheets;
}