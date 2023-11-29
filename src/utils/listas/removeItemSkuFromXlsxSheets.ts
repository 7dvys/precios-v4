import { XlsxSheet } from "@/types/AgregarTypes";
import { AccountType } from "@/types/Config";
import { ListaItem } from "@/types/Listas";

export const removeItemSkuFromXlsxSheets = ({xlsxSheets,codigo,account,sku}:{xlsxSheets:XlsxSheet[],codigo:string,account:AccountType,sku:string})=>{
    const newXlsxSheets = xlsxSheets.map(xlsxSheet=>{
        const {items} = xlsxSheet;
        const newItems = items.map(item=>{
            if(codigo !== item.codigo)
            return item;

            const newAccountCbItemsSkus = item.cbItemSkus[account].filter(accountSku=>accountSku!==sku)
            const newCbItemSkus = {...item.cbItemSkus,[account]:newAccountCbItemsSkus};
            const newItem:ListaItem = {...item,cbItemSkus:newCbItemSkus}
            return newItem;
        })

        const newXlsxSheet = {...xlsxSheet,items:newItems}
        return newXlsxSheet
    })
    return newXlsxSheets;
}