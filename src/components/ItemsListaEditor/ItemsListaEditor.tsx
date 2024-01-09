'use client'
import { ItemsListaEditorProps } from "@/types/AgregarTypes";
import { ItemsFields } from "./ItemsFields";
import { getTableItemsAndItemsDictionary } from "@/utils/itemsListaEditor/getTableItemsAndItemsDictionary";
import { ItemsTable } from "./ItemsTable";
import { TagsEditor } from "../TagsEditor";
import { inferTagsFromsItems } from "@/utils/itemsListaEditor/inferTagsFromItems";
import { genGroupFunctions } from "@/utils/itemsListaEditor/genGroupFunctions";
import { useTmpXlsxSheet } from "@/hooks/itemListaEditor/useTmpXlsxSheet";
import { listaItemsAndTmpXlsxSheetItemsUtils } from "@/utils/itemsListaEditor/listaItemsAndTmpXlsxSheetItemsUtils";
import { useTableItemIdToEditSkuList } from "@/hooks/itemListaEditor/useTableItemIdToEditSkuList";
import { ItemEditor } from "./ItemEditor";
import { Product } from "@/types/Contabilium";
import { AccountType } from "@/types/Config";
import { getProductByCodigo } from "@/services/contabilium/accountProducts";
import { serializeListaItems } from "@/utils/listas/serializeListaItems";
import { serializeProducts } from "@/utils/serializeProducts";
import { UpdateProductsModal } from "../UpdateProductsModal";
import { useContext, useEffect, useState } from "react";
import { genNewCbProductsFromLista } from "@/utils/itemsListaEditor/genNewCbProductsFromLista";
import { updateProducts } from "@/utils/contabilium/updateProducts";
import { Cotizaciones } from "@/types/Cotizaciones";
import { ContabiliumContext } from "@/contexts/ContabiliumContext";
import { cotizacionesUtils } from "@/utils/cotizaciones/cotizacionesUtils";
import { RemoveObservationModal } from "./RemoveObservationModal";

export const ItemsListaEditor:React.FC<ItemsListaEditorProps> = ({updateListaItem,lista,addSheet,removeSheet,addTag,removeTag,removeListaItem,saveLista,removeListaItemSku,addListaItemSku,readOnly})=>{
    const [onUpdate,setOnUpdate] = useState<boolean>(false);
    const [cotizaciones,setCotizaciones] = useState<Cotizaciones|undefined>(undefined)
    const {fixedProducts,rubrosWithSubRubrosPerAccount,tokens,updateProducts:updateContextProducts} = useContext(ContabiliumContext);

    const initCotizaciones = async ()=>{
        const {getCotizaciones} = await cotizacionesUtils({products:fixedProducts});
        const cotizaciones = getCotizaciones();
        setCotizaciones(cotizaciones);
    }

    useEffect(()=>{
        initCotizaciones();
    },[])
    
    const [removeObservationQueue,setRemoveObservationQueue] = useState<{sku:string,account:AccountType}[]>([]);
    const {tags,xlsxSheets,items,name,vendor,type} = lista;
        
    const {tmpXlsxSheet,addTmpXlsxSheetToLista,setTmpXlsxSheet,removeTmpXlsxSheet,removeTmpXlsxSheetItem,updateTmpXlsxSheetItem,removeTmpXlsxSheetItemSku,addTmpXlsxSheetItemSku} = useTmpXlsxSheet({addSheet})

    const {listaItemsAndTmpXlsxSheetItems,removeItem,removeItemSku,addItemSku} = listaItemsAndTmpXlsxSheetItemsUtils({listaItems:items,addListaItemSku,removeListaItem,removeListaItemSku,removeTmpXlsxSheetItem,updateListaItem,updateTmpXlsxSheetItem,removeTmpXlsxSheetItemSku,addTmpXlsxSheetItemSku,tmpXlsxSheetItems:tmpXlsxSheet.items})
    
    const serializedListaItems = serializeListaItems({listaItems:listaItemsAndTmpXlsxSheetItems});
    const serializedProducts = serializeProducts({products:fixedProducts});

    const inferedTags = inferTagsFromsItems({items:listaItemsAndTmpXlsxSheetItems,tags});
    const {itemsDictionary,tableItems} = getTableItemsAndItemsDictionary({products:fixedProducts,items:listaItemsAndTmpXlsxSheetItems,tags,rubrosWithSubRubros:rubrosWithSubRubrosPerAccount})

    const {tableItemIdToEditSkuList,removeTableItemIdToEditSkuList,addTableItemIdToEditSkuList,clearTableItemIdToEditSkuList} = useTableItemIdToEditSkuList()

    if(fixedProducts.main.length === 0 || fixedProducts.secondary.length === 0 || cotizaciones === undefined || lista===undefined)
    return <>cargando lista...</>;
        
    const groupFunctions = readOnly?undefined:genGroupFunctions({itemsDictionary,removeItemSku,setRemoveObservationQueue,listaItems:items,removeItem,addTableItemIdToEditSkuList});

    const getCbItemByCodigo = ({codigo,account}:{codigo:string,account:AccountType}):Promise<Product|{error:string}> =>{
        return getProductByCodigo({codigo,token:tokens[account]});
    }

    const createItemSku = ({product,account,codigo}:{product:Product,account:AccountType,codigo:string})=>{
        const newProducts = {main:[],secondary:[],[account]:[product]};
        updateContextProducts({newProducts});
        addItemSku({newSku:product.Codigo,account,codigo})
    }

    const initUpdateProducts = ()=>{
        const formatedProductsToUpdate = genNewCbProductsFromLista({lista,products:fixedProducts,cotizaciones})

        if(formatedProductsToUpdate === undefined)
        return false;
        
        return updateProducts(tokens,formatedProductsToUpdate,type);
    }

    const finishLista = async ()=>{
        saveLista();
        setOnUpdate(true);
    }
    
    const renderItemsFieldsAndTagsEditor = !readOnly && name && vendor;
    const renderItemsTable = listaItemsAndTmpXlsxSheetItems.length > 0 || readOnly ;
    const renderRemoveObservationModal = removeObservationQueue.length > 0

    return (
        <>
            {renderItemsFieldsAndTagsEditor && <TagsEditor tags={tags} addTag={addTag} removeTag={removeTag} inferedTags={inferedTags}/>}
            {renderItemsFieldsAndTagsEditor && <ItemsFields finishListaFunc={finishLista} removeSheet={removeSheet} tmpXlsxSheet={tmpXlsxSheet} setTmpXlsxSheet={setTmpXlsxSheet} addTmpXlsxSheetToLista={addTmpXlsxSheetToLista} removeTmpXlsxSheet={removeTmpXlsxSheet} xlsxSheets={xlsxSheets} cotizaciones={cotizaciones} products={fixedProducts} />}
            {renderItemsTable && <ItemsTable tableItems={tableItems} groupFunctions={groupFunctions}/>}
            
            <ItemEditor 
                clearTableItemIdToEditSkuList={clearTableItemIdToEditSkuList}
                updateListaItem={updateListaItem}
                serializedProducts={serializedProducts}
                serializedListaItems={serializedListaItems}
                cotizaciones={cotizaciones}
                tags={tags}
                tokens={tokens}
                fixedProducts={fixedProducts} 
                listaItemsAndTmpXlsxSheetItems={listaItemsAndTmpXlsxSheetItems} 
                tableItemIdToEditSkuList={tableItemIdToEditSkuList}
                rubrosWithSubRubros={rubrosWithSubRubrosPerAccount}
                removeTableItemIdToEditSkuList={removeTableItemIdToEditSkuList}
                itemsDictionary={itemsDictionary}
                removeItemSku={removeItemSku}
                addItemSku={addItemSku}
                getCbItemByCodigo={getCbItemByCodigo}
                createItemSku={createItemSku}
            />

            {onUpdate && <UpdateProductsModal updateContextProducts={updateContextProducts} cleanQueue={()=>{setOnUpdate(false)}} initUpdateProducts={initUpdateProducts}/>}
            {renderRemoveObservationModal && <RemoveObservationModal tokens={tokens} updateContextProducts={updateContextProducts} removeObservationQueue={removeObservationQueue} serializedProducts={serializedProducts} setRemoveObservationQueue={setRemoveObservationQueue}/>}
        </>
    )
}

