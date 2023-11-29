import { XlsxSheet } from "@/types/AgregarTypes";

export const removeItemFromXlsxSheets = ({xlsxSheets,codigo}:{xlsxSheets:XlsxSheet[],codigo:string})=>{
    return xlsxSheets.map(xlsxSheet=>{
        const {items} = xlsxSheet;
        const newItems = items.filter(item=>(codigo !== item.codigo))
        return {...xlsxSheet,items:newItems}
    })
}