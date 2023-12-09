import { XlsxSheet } from "@/types/AgregarTypes";
import { TableGroupFunction, TableItemIdentifier } from "@/types/TableTypes";
import { RemoveListaItem, RemoveListaItemSku } from "@/types/UseListasTypes";
import { Dispatch, SetStateAction } from "react";
import { removeItemFromXlsxSheets } from "../listas/removeItemFromXlsxSheets";
import { removeItemSkuFromXlsxSheets } from "../listas/removeItemSkuFromXlsxSheets";
import { AddIdsToTableItemIds } from "@/types/UseAddSkuModalTypes";

export const genGroupFunctions = ({itemsDictionary,removeItem,addTableItemIdToEditSkuList}:{
    itemsDictionary:Record<number,TableItemIdentifier>,
    removeItem:RemoveListaItem,
    addTableItemIdToEditSkuList:(id:number)=>void
}):TableGroupFunction[]=>{
  
    const removeRow = (selectedIds:number[])=>{
        const confirmRemove = selectedIds.length > 0 && confirm('Desea eliminar '+selectedIds.length+' items?')
        if(confirmRemove === false)
        return;
        
        selectedIds.forEach(selectedId=>{
            if(!(selectedId in itemsDictionary))
            return;

            const {codigo,sku,account} = itemsDictionary[selectedId]

            if(sku === null || account === null){
                removeItem({codigo})
            }
            // else{
            //     removeItemSku({codigo,sku,account})
            // }
        }) 
    }

    const editItemSkus = (selectedIds:number[])=>{
        selectedIds.forEach(selectedId=>{
            if(!(selectedId in itemsDictionary))
            return false;

            const {sku,account} = itemsDictionary[selectedId]
            if (sku === null && account === null)
            addTableItemIdToEditSkuList(selectedId)
        })
    }

    return [{label:'eliminar',functionHandler:removeRow},{label:'editar skus',functionHandler:editItemSkus}]
} 