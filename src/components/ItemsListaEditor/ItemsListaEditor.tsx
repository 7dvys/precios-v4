'use client'
import { ItemsListaEditorProps, XlsxSheet } from "@/types/AgregarTypes";
import { useMemo, useState } from 'react';
import { ListaItem } from '@/types/Listas';
import { genItemsFromLista } from "@/utils/listas/genItemsFromLista";
import { ItemsFields } from "./ItemsFields";
import { getTableItemsAndItemsDictionary } from "@/utils/itemsListaEditor/getTableItemsAndItemsDictionary";
import { ItemsTable } from "./ItemsTable";
import { TagsEditor } from "../TagsEditor";
import { inferTagsFromsItems } from "@/utils/itemsListaEditor/inferTagsFromItems";
import { genGroupFunctions } from "@/utils/itemsListaEditor/genGroupFunctions";

export const ItemsListaEditor:React.FC<ItemsListaEditorProps> = ({lista,cotizaciones,products,addSheet,removeSheet,addTag,removeTag,removeListaItem,removeListaItemSku,readOnly})=>{
    const {tags,xlsxSheets} = lista;
    const [xlsxSheet,setXlsxSheet] = useState<XlsxSheet>({fileName:'',sheetName:'',items:[]});

    const items = useMemo(()=>genItemsFromLista({lista,xlsxSheetItems:xlsxSheet.items}),[xlsxSheet.items,lista]);
    const inferedTags = inferTagsFromsItems({items,tags});
    const {itemsDictionary,tableItems} = getTableItemsAndItemsDictionary({products,items,tags})

    const groupFunctions = readOnly?undefined:genGroupFunctions({itemsDictionary,removeListaItem,removeListaItemSku,setXlsxSheet});

    

    const renderItemsFieldsAndTagsEditor = !readOnly && lista.name && lista.vendor;
    const renderItemsTable = items.length > 0 || readOnly ;

    return (
        <>
            {renderItemsFieldsAndTagsEditor && <TagsEditor tags={tags} addTag={addTag} removeTag={removeTag} inferedTags={inferedTags}/>}
            {renderItemsFieldsAndTagsEditor && <ItemsFields removeSheet={removeSheet} addSheet={addSheet} xlsxSheet={xlsxSheet} xlsxSheets={xlsxSheets} setXlsxSheet={setXlsxSheet} cotizaciones={cotizaciones} products={products} />}
            {renderItemsTable && <ItemsTable tableItems={tableItems} groupFunctions={groupFunctions}/>}
        </>
    )
}

