import { XlsxSheet } from "@/types/AgregarTypes";
import { AccountType } from "@/types/Config";
import { ListaItem } from "@/types/Listas";

export const changeItemCostoFromXlsxSheets = ({xlsxSheets,codigo,newCost}:{newCost:number,xlsxSheets:XlsxSheet[],codigo:string})=>{
    const newXlsxSheets = xlsxSheets.map(xlsxSheet=>{
        const {items} = xlsxSheet;
        const newItems = items.map(item=>{
            if(codigo !== item.codigo)
            return item;

            const newItem:ListaItem = {...item,costo:newCost}
            return newItem;
        })

        const newXlsxSheet = {...xlsxSheet,items:newItems}
        return newXlsxSheet
    })
    return newXlsxSheets;
}