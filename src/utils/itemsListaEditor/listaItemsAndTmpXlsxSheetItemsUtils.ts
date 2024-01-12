import { AddListaItemSku, RemoveListaItem, RemoveListaItemSku, UpdateListaItem } from "@/types/UseListasTypes";
import { genItemsFromLista } from "../listas/genItemsFromLista";
import { ListaItem, ListaItemOptionalValues } from "@/types/Listas";
import { AccountType } from "@/types/Config";

export const listaItemsAndTmpXlsxSheetItemsUtils = ({listaItems,tmpXlsxSheetItems,updateListaItem,updateTmpXlsxSheetItem,addTmpXlsxSheetItemSku,removeTmpXlsxSheetItem,removeTmpXlsxSheetItemSku,removeListaItem,removeListaItemSku,addListaItemSku}:{
    addListaItemSku:AddListaItemSku,
    removeListaItem:RemoveListaItem,
    removeListaItemSku:RemoveListaItemSku,
    removeTmpXlsxSheetItem:RemoveListaItem,
    removeTmpXlsxSheetItemSku:RemoveListaItemSku
    updateTmpXlsxSheetItem:UpdateListaItem;
    updateListaItem:UpdateListaItem;
    addTmpXlsxSheetItemSku:AddListaItemSku,
    
    listaItems:ListaItem[],
    tmpXlsxSheetItems:ListaItem[]


})=>{
    const listaItemsAndTmpXlsxSheetItems = genItemsFromLista({listaItems,tmpXlsxSheetItems});

    const removeItem = ({codigo}:{codigo:string})=>{
        removeListaItem({codigo});
        removeTmpXlsxSheetItem({codigo});
    } 

    const updateItem = (params:{codigo:string,newItemValues:ListaItemOptionalValues})=>{
        updateListaItem(params);
        updateTmpXlsxSheetItem(params);
    }

    const removeItemSku = (params:{codigo:string,sku:string,account:AccountType})=>{
        removeListaItemSku(params);
        removeTmpXlsxSheetItemSku(params);
    }

    const addItemSku = (params:{codigo:string,newSku:string,account:AccountType})=>{
        addListaItemSku(params)
        addTmpXlsxSheetItemSku(params)
    }

    return {listaItemsAndTmpXlsxSheetItems,removeItem,updateItem,removeItemSku,addItemSku}
}