import { XlsxSheet } from "@/types/AgregarTypes";
import { ListaItem, ListaItemOptionalValues } from "@/types/Listas";

export const updateItemFromXlsxSheets = ({xlsxSheets,codigo,newItemValues}:{
    xlsxSheets:XlsxSheet[],
    codigo:string,
    newItemValues:ListaItemOptionalValues
})=>{
    return xlsxSheets.map(xlsxSheet=>{
        const {items} = xlsxSheet;
        const newItems:ListaItem[] = items.map(item=>{
            if(codigo !== item.codigo)
            return item;

            const newItem = {...item,...newItemValues}
            return newItem as ListaItem; 
        })
        return {...xlsxSheet,items:newItems}
    })
}