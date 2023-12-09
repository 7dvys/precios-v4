'use client'
import { AddSkuModalProps } from "@/types/AgregarTypes";
import { SkuEditorModal } from "./skuEditorModal";
import { serializeProducts } from "@/utils/serializeProducts";
import { serializeListaItems } from "@/utils/listas/serializeListaItems";


// Podemos agregar las sugerencias en el sku editor!! 

// agregar => busca en products => si no esta busca con la api => si no esta lo puedes crear;
export const SkuEditor:React.FC<AddSkuModalProps> = ({productsWithNewProducts,listaItemsAndTmpXlsxSheetItems,tableItemIdToEditSkuList,removeTableItemIdToEditSkuList,rubrosWithSubRubros,itemsDictionary,getCbItemByCodigo,createItemSku,addItemSku,removeItemSku})=>{
    const serializedProducts = serializeProducts({products:productsWithNewProducts});
    const serializedListaItems = serializeListaItems({listaItems:listaItemsAndTmpXlsxSheetItems});
    
    const renderSkuEditorModal = tableItemIdToEditSkuList.length > 0;

    if(!renderSkuEditorModal)
    return null

    const firstTableItemIdToEdit = tableItemIdToEditSkuList[0];
    const firstListaItemIdentify = itemsDictionary[firstTableItemIdToEdit];
    const firstListaItem = serializedListaItems[firstListaItemIdentify.codigo];

    const removeFirstTableItemIdToEdit = ()=>{
        removeTableItemIdToEditSkuList(firstTableItemIdToEdit);
    }
  
    return <SkuEditorModal rubrosWithSubRubros={rubrosWithSubRubros} addItemSku={addItemSku} listaItem={firstListaItem} removeFirstTableItemIdToEdit={removeFirstTableItemIdToEdit} removeItemSku={removeItemSku} productsWithNewProducts={productsWithNewProducts} getCbItemByCodigo={getCbItemByCodigo} createItemSku={createItemSku}/>;
}
