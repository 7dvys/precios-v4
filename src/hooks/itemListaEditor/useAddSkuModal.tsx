import { AddSkuModal } from "@/components/ItemsListaEditor/AddSkuModal";
import { XlsxSheet } from "@/types/AgregarTypes";
import { AccountType } from "@/types/Config";
import { Product, RubrosWithSubRubrosPerAccount } from "@/types/Contabilium";
import { ListaItem } from "@/types/Listas";
import { Products } from "@/types/Products";
import { TableItemIdentifier } from "@/types/TableTypes";
import { AddListaItemSku } from "@/types/UseListasTypes";
import { Dispatch, SetStateAction, useState } from "react"

export const useAddSkuModal = ({products,itemsDictionary,items,rubrosWithSubRubros,addListaItemSku,addProducts,setXlsxSheet}:{
    products:Products,
    itemsDictionary:Record<number, TableItemIdentifier>,
    items:ListaItem[],
    rubrosWithSubRubros:RubrosWithSubRubrosPerAccount,
    addProducts: (newProducts: {
        product: Product;
        account: AccountType;
    }[]) => void,
    addListaItemSku: AddListaItemSku,
    setXlsxSheet: Dispatch<SetStateAction<XlsxSheet>>
})=>{
    const [tableItemIdsToAdd,setTableItemIdsToAdd] = useState<number[]>([]);

    const addIdsToTableItemIds = (ids:number[])=>{
        setTableItemIdsToAdd(currentTableItemIdsToAdd=>{
            const newTableItemIdsToAdd = [...currentTableItemIdsToAdd,...ids];
            return newTableItemIdsToAdd;
        })
    } 

    const removeIdToTableItemIds = (removeId:number)=>{
        setTableItemIdsToAdd(currentTableItemIdsToAdd=>{
            const currentTableItemIdsToAddWithoutDeleteRemoveId = currentTableItemIdsToAdd.filter(id=>id!==removeId)
            return currentTableItemIdsToAddWithoutDeleteRemoveId;
        })
    }

    const firstTableItemIds = tableItemIdsToAdd.length>0?tableItemIdsToAdd[0]:null
    const tableItemIdentifier = firstTableItemIds!==null?itemsDictionary[firstTableItemIds]:null;
    const listaItem = tableItemIdentifier !== null?items.find(({codigo})=>(codigo === tableItemIdentifier.codigo)) as ListaItem:null;
    
    const renderAddSkuModal = firstTableItemIds !== null && tableItemIdentifier !== null && listaItem !== null;

    return {
        addIdsToTableItemIds,
        addSkuModal:renderAddSkuModal?<AddSkuModal addListaItemSku={addListaItemSku} setXlsxSheet={setXlsxSheet} addProducts={addProducts} rubrosWithSubRubros={rubrosWithSubRubros} products={products} listaItem={listaItem} cancelHandler={()=>{removeIdToTableItemIds(firstTableItemIds)}}/>:null
    }
}

