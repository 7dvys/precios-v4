import { XlsxSheet } from "@/types/AgregarTypes";
import { AccountType } from "@/types/Config";
import { AddSheet } from "@/types/UseListasTypes";
import { addItemSkuFromXlsxSheets } from "@/utils/listas/addItemSkuFromXlsxSheets";
import { removeItemFromXlsxSheets } from "@/utils/listas/removeItemFromXlsxSheets";
import { removeItemSkuFromXlsxSheets } from "@/utils/listas/removeItemSkuFromXlsxSheets";
import { useState } from "react";

export const useTmpXlsxSheet = ({addSheet}:{addSheet:AddSheet})=>{
    const defaultXlsxSheet = {fileName:'',sheetName:'',items:[]};
    const [tmpXlsxSheet,setTmpXlsxSheet] = useState<XlsxSheet>(defaultXlsxSheet);
    const addTmpXlsxSheetToLista = ()=>addSheet({xlsxSheet:tmpXlsxSheet});
    const removeTmpXlsxSheet = ()=>setTmpXlsxSheet(defaultXlsxSheet);

    const removeTmpXlsxSheetItem = ({codigo}:{codigo:string})=>{
        setTmpXlsxSheet(currentTmpXlsxSheet=>{
            const newTmpXlsxSheet = removeItemFromXlsxSheets({xlsxSheets:[currentTmpXlsxSheet],codigo})[0];
            return newTmpXlsxSheet;
        })
    }

    const addTmpXlsxSheetItemSku =  (params:{codigo:string,newSku:string,account:AccountType})=>{
        setTmpXlsxSheet(currentTmpXlsxSheet=>{
            const newXlsxSheet = addItemSkuFromXlsxSheets({xlsxSheets:[currentTmpXlsxSheet],...params})[0]
            return newXlsxSheet;
        })
    }

    const removeTmpXlsxSheetItemSku = (params:{codigo:string,sku:string,account:AccountType})=>{
        setTmpXlsxSheet(currentTmpXlsxSheet=>{
            const newXlsxSheet = removeItemSkuFromXlsxSheets({xlsxSheets:[currentTmpXlsxSheet],...params})[0]
            return newXlsxSheet;
        })
    }

    return {tmpXlsxSheet,setTmpXlsxSheet,addTmpXlsxSheetToLista,removeTmpXlsxSheet,removeTmpXlsxSheetItem,addTmpXlsxSheetItemSku,removeTmpXlsxSheetItemSku}
}