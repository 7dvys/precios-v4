import { defaultLista } from "@/constants/defaultLista";
import { SheetInformation, XlsxSheet } from "@/types/AgregarTypes";
import { AccountType } from "@/types/Config";
import { Lista, ListaItem, ListaItemOptionalValues, Tag } from "@/types/Listas";
import { SetNameVendorAndTypeParams, UseListasProps } from "@/types/UseListasTypes";
import { addItemSkuFromXlsxSheets } from "@/utils/listas/addItemSkuFromXlsxSheets";
import { removeItemFromXlsxSheets } from "@/utils/listas/removeItemFromXlsxSheets";
import { removeItemSkuFromXlsxSheets } from "@/utils/listas/removeItemSkuFromXlsxSheets";
import { useEffect, useState } from "react";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";
import { changeXlsxSheetsCosts } from "@/utils/listas/changeXlsxSheetsCosts";
import { isClient } from "@/constants/isClient";
import { changeItemCostoFromXlsxSheets } from "@/utils/listas/changeItemFromXlsxSheets";
import { updateItemFromXlsxSheets } from "@/utils/listas/updateItemFromXlsxSheets";
import { genListaItemsFromXlsxSheets } from "@/utils/listas/genListaItemsFromXlsxSheets";
import { serializeXlsxSheets } from "@/utils/listas/serializeXlsxSheets";

export const useListas = ({initialLista}:UseListasProps)=>{


    const [lista,setLista] = useState<Lista>(defaultLista);

    useEffect(()=>{
        if(initialLista !== undefined)
        setLista(initialLista);
    },[initialLista])

    const changeListaAllCosts = ({factor}:{factor:number})=>{
        setLista(currentLista=>{
            const {xlsxSheets} = currentLista
            const newXlsxSheets = changeXlsxSheetsCosts({xlsxSheets,factor})
            const newLista:Lista = {...currentLista,xlsxSheets:newXlsxSheets};
            return newLista;
        })
    }

    const changeListaItemCosto = ({newCost,codigo}:{newCost:number,codigo:string})=>{
        setLista(currentLista=>{
            const {xlsxSheets} = currentLista
            const newXlsxSheets = changeItemCostoFromXlsxSheets({xlsxSheets,newCost,codigo});
            const newLista:Lista = {...currentLista,xlsxSheets:newXlsxSheets};
            return newLista;
        })
    }

    // const changeListaItemCotizacion = ({})

    const setNameVendorAndType = ({name,vendor,vendorId,type}:SetNameVendorAndTypeParams)=>{
        setLista(currentLista=>({...currentLista,name,vendor,vendorId,type}))
    }

    const setType = ({type}:{type:AccountType|'both'})=>{
        setLista(currentLista=>({...currentLista,type}))
    }

    const saveLista = async ()=>{
        if(!isClient)
        return;
        
        const {saveListas} = await dbListasUtils()
        saveListas({listas:[lista]});
    }

    const addSheet = ({xlsxSheet}:{xlsxSheet:XlsxSheet})=>{
        setLista(currentLista=>{
            const currentXlsxSheets = currentLista.xlsxSheets;

            const serializedCurrentXlsxSheets = serializeXlsxSheets(currentXlsxSheets);
            const serializedNewXlsxSheet = serializeXlsxSheets([xlsxSheet]);
            const serializedNewXlsxSheets = {...serializedCurrentXlsxSheets,...serializedNewXlsxSheet};
            const newXlsxSheets = Object.values(serializedNewXlsxSheets);

            const newLista:Lista = {...currentLista,xlsxSheets:newXlsxSheets};
            console.log(newLista)
            return newLista;
        })
    }

    const setItems = ()=>{
        const {xlsxSheets} = lista;
    
       const items = genListaItemsFromXlsxSheets(xlsxSheets);

        setLista(currentLista=>{
            const newLista:Lista = {...currentLista,items}
            return newLista
        })
    }

    const removeSheet = ({sheetInformation}:{sheetInformation:SheetInformation}) => {
        setLista(currentLista=>{
            const newXlsxSheets = currentLista.xlsxSheets.filter(({sheetName,fileName})=>(sheetName !== sheetInformation.sheetName && fileName !== sheetInformation.fileName))
            const newLista:Lista = {...currentLista, xlsxSheets:newXlsxSheets}
            return newLista;
        })  
    }

    const addTag = ({tagId,tag}:{tagId:string,tag:Tag})=>{
        if(tagId)
        setLista(currentLista=>{
            const newTags = currentLista.tags;
            newTags[tagId] = tag;
            return {...currentLista,tags:newTags};
        })
    }

    const removeTag = ({tagId}:{tagId:string})=>{
        setLista(currentLista=>{
            const {[tagId]:removedTag,...newTags} = currentLista.tags;
            const newLista:Lista = {...currentLista,tags:newTags}
            return newLista;
        })
    }

    const removeListaItem = ({codigo}:{codigo:string})=>{
        setLista(currentLista=>{
            const {xlsxSheets} = currentLista
            const newXlsxSheets = removeItemFromXlsxSheets({xlsxSheets,codigo});
            return {...currentLista,xlsxSheets:newXlsxSheets};
        })
    }

    const updateListaItem = ({codigo,newItemValues}:{codigo:string,newItemValues:ListaItemOptionalValues})=>{
        setLista(currentLista=>{
            const {xlsxSheets} = currentLista
            const newXlsxSheets = updateItemFromXlsxSheets({xlsxSheets,codigo,newItemValues});
            return {...currentLista,xlsxSheets:newXlsxSheets};
        })
    }


    const addListaItemSku =  (params:{codigo:string,newSku:string,account:AccountType})=>{
        setLista(currentLista=>{
            const {xlsxSheets} = currentLista
            const newXlsxSheets = addItemSkuFromXlsxSheets({xlsxSheets,...params})
            const newLista:Lista = {...currentLista,xlsxSheets:newXlsxSheets};
            return newLista;
        })
    }

    const removeListaItemSku = (params:{codigo:string,sku:string,account:AccountType})=>{
        setLista(currentLista=>{
            const {xlsxSheets} = currentLista
            const newXlsxSheets = removeItemSkuFromXlsxSheets({xlsxSheets,...params})
            const newLista:Lista = {...currentLista,xlsxSheets:newXlsxSheets};
            return newLista;
        })
    }


    useEffect(setItems,[lista.xlsxSheets])
    
    return {lista,setType,setNameVendorAndType,addSheet,saveLista,updateListaItem,changeListaItemCosto,changeListaAllCosts,removeSheet,removeListaItem,removeListaItemSku,addListaItemSku,addTag,removeTag};
}