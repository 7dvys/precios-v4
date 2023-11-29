import { XlsxSheet } from "@/types/AgregarTypes";
import { TableGroupFunction, TableItemIdentifier } from "@/types/TableTypes";
import { RemoveListaItem, RemoveListaItemSku } from "@/types/UseListasTypes";
import { Dispatch, SetStateAction } from "react";
import { removeItemFromXlsxSheets } from "../listas/removeItemFromXlsxSheets";
import { removeItemSkuFromXlsxSheets } from "../listas/removeItemSkuFromXlsxSheets";

export const genGroupFunctions = ({itemsDictionary,removeListaItem,removeListaItemSku,setXlsxSheet}:{
    itemsDictionary:Record<number,TableItemIdentifier>,
    removeListaItem:RemoveListaItem,
    removeListaItemSku:RemoveListaItemSku,
    setXlsxSheet:Dispatch<SetStateAction<XlsxSheet>>
}):TableGroupFunction[]=>{

    const removeRow = (selectedId:number[])=>{
        selectedId.forEach(selectedId=>{
            if(!(selectedId in itemsDictionary))
            return;

            const {codigo,sku,account} = itemsDictionary[selectedId]
            if(sku === null || account === null){
                removeListaItem({codigo})
                setXlsxSheet(currentXlsxSheet=>{
                    const [newXlsxSheet] = removeItemFromXlsxSheets({xlsxSheets:[currentXlsxSheet],codigo});
                    return newXlsxSheet
                })
            }
            else{
                removeListaItemSku({codigo,sku,account})
                setXlsxSheet(currentXlsxSheet=>{
                    const [newXlsxSheet] = removeItemSkuFromXlsxSheets({xlsxSheets:[currentXlsxSheet],codigo,sku,account})
                    return newXlsxSheet
                })
            }
        }) 
    }

    return [{label:'eliminar',functionHandler:removeRow}]
} 