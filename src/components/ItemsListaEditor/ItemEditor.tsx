'use client'
import { ItemEditorProps } from "@/types/AgregarTypes";
import { ItemEditorModal } from "./ItemEditorModal";

export const ItemEditor:React.FC<ItemEditorProps> = ({
    setRemoveObservationQueue,
    deposits,
    clearTableItemIdToEditSkuList,
    updateListaItem,
    serializedProducts,
    serializedListaItems,
    cotizaciones,
    tags,
    tokens,
    fixedProducts,
    tableItemIdToEditSkuList,
    removeTableItemIdToEditSkuList,
    rubrosWithSubRubros,
    itemsDictionary,
    getCbItemByCodigo,
    createItemSku,
    addItemSku,
    removeItemSku
})=>{
    const renderItemEditorModal = tableItemIdToEditSkuList.length > 0;

    if(!renderItemEditorModal)
    return null

    const firstTableItemIdToEdit = tableItemIdToEditSkuList[0];
    const firstListaItemIdentify = itemsDictionary[firstTableItemIdToEdit];
    const firstListaItem = serializedListaItems[firstListaItemIdentify.codigo];

    const removeFirstTableItemIdToEdit = ()=>{
        removeTableItemIdToEditSkuList(firstTableItemIdToEdit);
    }
  
    return <ItemEditorModal setRemoveObservationQueue={setRemoveObservationQueue} deposits={deposits} clearTableItemIdToEditSkuList={clearTableItemIdToEditSkuList} updateListaItem={updateListaItem} serializedProducts={serializedProducts} cotizaciones={cotizaciones} tags={tags} tokens={tokens} rubrosWithSubRubros={rubrosWithSubRubros} addItemSku={addItemSku} listaItem={firstListaItem} removeFirstTableItemIdToEdit={removeFirstTableItemIdToEdit} removeItemSku={removeItemSku} productsWithNewProducts={fixedProducts} getCbItemByCodigo={getCbItemByCodigo} createItemSku={createItemSku}/>;
}
