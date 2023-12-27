import { XlsxSheet } from "@/types/AgregarTypes";
import { AccountType } from "@/types/Config";
import { ListaItem, ListaItemOptionalValues } from "@/types/Listas";
import { AddSheet } from "@/types/UseListasTypes";
import { addItemSkuFromXlsxSheets } from "@/utils/listas/addItemSkuFromXlsxSheets";
import { changeItemCostoFromXlsxSheets } from "@/utils/listas/changeItemFromXlsxSheets";
import { changeXlsxSheetsCosts } from "@/utils/listas/changeXlsxSheetsCosts";
import { removeItemFromXlsxSheets } from "@/utils/listas/removeItemFromXlsxSheets";
import { removeItemSkuFromXlsxSheets } from "@/utils/listas/removeItemSkuFromXlsxSheets";
import { updateItemFromXlsxSheets } from "@/utils/listas/updateItemFromXlsxSheets";
import { useState } from "react";

export const useTmpXlsxSheet = ({addSheet}:{addSheet:AddSheet})=>{
    const defaultXlsxSheet = {fileName:'',sheetName:'',items:[]};
    const [tmpXlsxSheet,setTmpXlsxSheet] = useState<XlsxSheet>(defaultXlsxSheet);
    const addTmpXlsxSheetToLista = ()=>addSheet({xlsxSheet:tmpXlsxSheet});
    const removeTmpXlsxSheet = ()=>setTmpXlsxSheet(defaultXlsxSheet);

    
    const updateTmpXlsxSheetItem = ({codigo,newItemValues}:{codigo:string,newItemValues:ListaItemOptionalValues})=>{
        setTmpXlsxSheet(currentTmpXlsxSheet=>{
            const newTmpXlsxSheet = updateItemFromXlsxSheets({xlsxSheets:[currentTmpXlsxSheet],codigo,newItemValues})[0];
            return newTmpXlsxSheet;
        })
    }

    const removeTmpXlsxSheetItem = ({codigo}:{codigo:string})=>{
        setTmpXlsxSheet(currentTmpXlsxSheet=>{
            const newTmpXlsxSheet = removeItemFromXlsxSheets({xlsxSheets:[currentTmpXlsxSheet],codigo})[0];
            return newTmpXlsxSheet;
        })
    }

    const changeTmpXlsxSheetItemCosto = ({codigo,newCost}:{codigo:string,newCost:number})=>{
        setTmpXlsxSheet(currentTmpXlsxSheet=>{
            const newXlsxSheet = changeItemCostoFromXlsxSheets({codigo,newCost,xlsxSheets:[currentTmpXlsxSheet]})[0]
            return newXlsxSheet;
        })
    }

    const changeTmpXlsxSheetpAllCosts = ({factor}:{factor:number})=>{
        setTmpXlsxSheet(currentXlsxSheet=>{
            const newXlsxSheet = changeXlsxSheetsCosts({xlsxSheets:[currentXlsxSheet],factor})[0]
            return newXlsxSheet;
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

    return {tmpXlsxSheet,setTmpXlsxSheet,updateTmpXlsxSheetItem,changeTmpXlsxSheetItemCosto,addTmpXlsxSheetToLista,removeTmpXlsxSheet,removeTmpXlsxSheetItem,addTmpXlsxSheetItemSku,removeTmpXlsxSheetItemSku}
}