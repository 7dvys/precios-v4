import { TableGroupFunction, TableItemIdentifier } from "@/types/TableTypes";
import { RemoveListaItem, RemoveListaItemSku, } from "@/types/UseListasTypes";
import { ListaItem } from "@/types/Listas";
import { AccountType } from "@/types/Config";
import { Dispatch, SetStateAction } from "react";


export const genGroupFunctions = ({itemsDictionary,removeItemSku,removeItem,addTableItemIdToEditSkuList,setRemoveObservationQueue}:{
    listaItems:ListaItem[]
    itemsDictionary:Record<number,TableItemIdentifier>,
    removeItem:RemoveListaItem,
    removeItemSku:RemoveListaItemSku,
    addTableItemIdToEditSkuList:(id:number)=>void
    setRemoveObservationQueue:Dispatch<SetStateAction<{sku:string,account:AccountType}[]>>

}):TableGroupFunction[]=>{
  
    const removeRow = (selectedIds:number[],clearSelections:()=>void)=>{
        const confirmRemove = selectedIds.length > 0 && confirm('Desea eliminar los items seleccionados?') 
        if(confirmRemove === false)
        return;

        const removeObservationQueue:{sku:string,account:AccountType}[] = [];

        const deleteListaItemsBoolean = confirm('Desea eliminar los elementos de lista?'); 
        
        selectedIds.forEach(selectedId=>{
            if(!(selectedId in itemsDictionary))
            return;

            const {codigo,sku,account} = itemsDictionary[selectedId];

            const isListaSkuItem = sku !== null && account !== null;

            if(isListaSkuItem){
                removeItemSku({codigo,sku,account})
                removeObservationQueue.push({sku,account})
            }
            
            if(deleteListaItemsBoolean)
            return removeItem({codigo});
        }) 

        setRemoveObservationQueue(removeObservationQueue);
        clearSelections();
    }

    const editItems = (selectedIds:number[],clearSelections:()=>void)=>{
        selectedIds.forEach(selectedId=>{
            if(!(selectedId in itemsDictionary))
            return false;

            const {sku,account} = itemsDictionary[selectedId]
            if (sku === null && account === null)
            addTableItemIdToEditSkuList(selectedId)
        })
        // clearSelections();
    }

    return [
        // {label:'editar costos',functionHandler:changeListaItemsCost},
        {label:'editar items',functionHandler:editItems},
        {label:'eliminar',functionHandler:removeRow},

    ]
} 