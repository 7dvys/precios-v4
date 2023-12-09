'use client'
import { ItemsListaEditorProps } from "@/types/AgregarTypes";
import { ItemsFields } from "./ItemsFields";
import { getTableItemsAndItemsDictionary } from "@/utils/itemsListaEditor/getTableItemsAndItemsDictionary";
import { ItemsTable } from "./ItemsTable";
import { TagsEditor } from "../TagsEditor";
import { inferTagsFromsItems } from "@/utils/itemsListaEditor/inferTagsFromItems";
import { genGroupFunctions } from "@/utils/itemsListaEditor/genGroupFunctions";
import { useTmpXlsxSheet } from "@/hooks/itemListaEditor/useTmpXlsxSheet";
import { useNewProducts } from "@/hooks/itemListaEditor/useNewProducts";
import { listaItemsAndTmpXlsxSheetItemsUtils } from "@/utils/itemsListaEditor/listaItemsAndTmpXlsxSheetItemsUtils";
import { useTableItemIdToEditSkuList } from "@/hooks/itemListaEditor/useTableItemIdToEditSkuList";
import { SkuEditor } from "./SkuEditor";
import { Product, Tokens } from "@/types/Contabilium";
import { AccountType } from "@/types/Config";
import { getProductByCodigo } from "@/services/contabilium/accountProducts";

export const ItemsListaEditor:React.FC<ItemsListaEditorProps> = ({lista:{tags,xlsxSheets,items,name,vendor},cotizaciones,products,rubrosWithSubRubros,addSheet,removeSheet,addTag,removeTag,removeListaItem,removeListaItemSku,addListaItemSku,readOnly,tokens})=>{
    const {productsWithNewProducts,createNewProduct} = useNewProducts({products});
    const {tmpXlsxSheet,addTmpXlsxSheetToLista,setTmpXlsxSheet,removeTmpXlsxSheet,removeTmpXlsxSheetItem,removeTmpXlsxSheetItemSku,addTmpXlsxSheetItemSku} = useTmpXlsxSheet({addSheet})

    const {listaItemsAndTmpXlsxSheetItems,removeItem,removeItemSku,addItemSku} = listaItemsAndTmpXlsxSheetItemsUtils({listaItems:items,addListaItemSku,removeListaItem,removeListaItemSku,removeTmpXlsxSheetItem,removeTmpXlsxSheetItemSku,addTmpXlsxSheetItemSku,tmpXlsxSheetItems:tmpXlsxSheet.items})

    const inferedTags = inferTagsFromsItems({items:listaItemsAndTmpXlsxSheetItems,tags});
    const {itemsDictionary,tableItems} = getTableItemsAndItemsDictionary({products:productsWithNewProducts,items:listaItemsAndTmpXlsxSheetItems,tags,rubrosWithSubRubros})

    const {tableItemIdToEditSkuList,removeTableItemIdToEditSkuList,addTableItemIdToEditSkuList} = useTableItemIdToEditSkuList()
    
    const groupFunctions = readOnly?undefined:genGroupFunctions({itemsDictionary,removeItem,addTableItemIdToEditSkuList});

    const getCbItemByCodigo = ({codigo,account}:{codigo:string,account:AccountType}):Promise<Product|{error:string}> =>{
        const tokenKey:keyof Tokens = account === 'main'?'cbTokenMain':'cbTokenSecondary'
        return getProductByCodigo({codigo,token:tokens[tokenKey]})
    }

    const createItemSku = ({product,account,codigo}:{product:Product,account:AccountType,codigo:string})=>{
        createNewProduct({product,account});
        addItemSku({newSku:product.Codigo,account,codigo})
    }
    
    const renderItemsFieldsAndTagsEditor = !readOnly && name && vendor;
    const renderItemsTable = listaItemsAndTmpXlsxSheetItems.length > 0 || readOnly ;

    return (
        <>
            {renderItemsFieldsAndTagsEditor && <TagsEditor tags={tags} addTag={addTag} removeTag={removeTag} inferedTags={inferedTags}/>}
            {renderItemsFieldsAndTagsEditor && <ItemsFields removeSheet={removeSheet} tmpXlsxSheet={tmpXlsxSheet} setTmpXlsxSheet={setTmpXlsxSheet} addTmpXlsxSheetToLista={addTmpXlsxSheetToLista} removeTmpXlsxSheet={removeTmpXlsxSheet} xlsxSheets={xlsxSheets} cotizaciones={cotizaciones} products={productsWithNewProducts} />}
            {renderItemsTable && <ItemsTable tableItems={tableItems} groupFunctions={groupFunctions}/>}
            
            <SkuEditor 
                productsWithNewProducts={productsWithNewProducts} 
                listaItemsAndTmpXlsxSheetItems={listaItemsAndTmpXlsxSheetItems} 
                tableItemIdToEditSkuList={tableItemIdToEditSkuList}
                rubrosWithSubRubros={rubrosWithSubRubros}
                removeTableItemIdToEditSkuList={removeTableItemIdToEditSkuList}
                itemsDictionary={itemsDictionary}
                removeItemSku={removeItemSku}
                addItemSku={addItemSku}
                getCbItemByCodigo={getCbItemByCodigo}
                createItemSku={createItemSku}
            />
        </>
    )
}

