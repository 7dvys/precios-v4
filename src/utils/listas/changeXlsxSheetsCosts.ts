import { XlsxSheet } from "@/types/AgregarTypes";

export const changeXlsxSheetsCosts = ({xlsxSheets,factor}:{xlsxSheets:XlsxSheet[],factor:number})=>{
    const newXlsxSheets = xlsxSheets.map(xlsxSheet=>{
        const {items} = xlsxSheet;
        const newItems = items.map(item=>{
            const newItemCost = item.costo*factor;
            return {...item,costo:newItemCost}
        })

        const newXlsxSheet = {...xlsxSheet,items:newItems}
        return newXlsxSheet
    })
    return newXlsxSheets;
}