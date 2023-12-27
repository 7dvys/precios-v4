import { TableGroupFunction, TableItemIdentifier } from "@/types/TableTypes";
import { RemoveListaItem, RemoveListaItemSku, } from "@/types/UseListasTypes";
import { parseStringToDecimalNumber } from "../parseStringToDecimalNumber";
import { ListaItem } from "@/types/Listas";
import { serializeListaItems } from "../listas/serializeListaItems";


export const genGroupFunctions = ({itemsDictionary,listaItems,removeItemSku,removeItem,addTableItemIdToEditSkuList}:{
    listaItems:ListaItem[]
    itemsDictionary:Record<number,TableItemIdentifier>,
    removeItem:RemoveListaItem,
    removeItemSku:RemoveListaItemSku,
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
            else{
                removeItemSku({codigo,sku,account})
            }
        }) 
    }

    // const changeListaItemsCost = (selectedIds:number[])=>{
    //     const serializedListaItems = serializeListaItems({listaItems});

    //     selectedIds.forEach(selectedId=>{
    //         if(!(selectedId in itemsDictionary))
    //         return;
        
    //         const {codigo,sku,account} = itemsDictionary[selectedId];

    //         if(sku !== null || account !== null)
    //         return;

    //         const listaItem = serializedListaItems[codigo];

    //         const promptText = `Modificar costo para el codigo: ${codigo}?`
    //         const newCostString = prompt(promptText,listaItem.costo.toString()) || '';
    //         const newCost = parseStringToDecimalNumber(newCostString);

    //         if(newCost === false)
    //         return;

    //         changeItemCosto({newCost,codigo})
    //     })
    // }

    const editItems = (selectedIds:number[])=>{
        selectedIds.forEach(selectedId=>{
            if(!(selectedId in itemsDictionary))
            return false;

            const {sku,account} = itemsDictionary[selectedId]
            if (sku === null && account === null)
            addTableItemIdToEditSkuList(selectedId)
        })
    }

    return [
        // {label:'editar costos',functionHandler:changeListaItemsCost},
        {label:'editar items',functionHandler:editItems},
        {label:'eliminar',functionHandler:removeRow},

    ]
} 