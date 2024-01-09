import { DATABASE } from "@/constants/database"
import { indexedDbUtils } from "../indexedDbUtils"
import {  DbLista, Lista } from "@/types/Listas"
import { genListaItemsFromXlsxSheets } from "./genListaItemsFromXlsxSheets";
import { serializeXlsxSheets } from "./serializeXlsxSheets";

const serializeDbListasByName = (dbListas:Record<number,DbLista>)=>{
    return Object.values(dbListas).reduce((acc,dbLista)=>{
        acc[dbLista.name] = dbLista;
        return acc;
    },{} as Record<string,DbLista>)
}

export const dbListasUtils =async ()=>{
    const {getAll,add,remove,update} = await indexedDbUtils<Lista>(DATABASE.OBJECTS_STORE.listas);
    
    const saveListas = async ({listas}:{listas:Lista[]})=>{
        const currentListas = await getListas();
        const serializedCurrentListas = serializeDbListasByName(currentListas);

        listas.forEach(lista=>{
            const isInCurrentListas = lista.name in serializedCurrentListas;
            
            if(!isInCurrentListas)
            return add([lista]);
            
            const listaInCurrentListas = serializedCurrentListas[lista.name];
            
            const serializedXlsxSheetsFromLista =  serializeXlsxSheets(lista.xlsxSheets);
            const serializedXlsxSheetsFromCurrentLista =  serializeXlsxSheets(listaInCurrentListas.xlsxSheets);

            const newXlsxSheets = Object.values({...serializedXlsxSheetsFromCurrentLista,...serializedXlsxSheetsFromLista})
            
            const newItems = genListaItemsFromXlsxSheets(newXlsxSheets)
            
            const newUpdatedLista:DbLista = {...listaInCurrentListas,...lista,xlsxSheets:newXlsxSheets,items:newItems};
        
            return update([newUpdatedLista]);
        })
    }

    // const updateListas = async ({listas}:{ listas: Lista[]})=>{
    //     const currentListas = await getListas()

    //     const listasInDb = listas.map(lista=>{
    //         const listaInCurrentListas = Object.values(currentListas).find(({name})=>name===lista.name);
    //         if(listaInCurrentListas === undefined)
    //         return null

    //         return {...listaInCurrentListas,...lista};
    //     })
    //     .filter((lista):lista is (Lista & {
    //         id: number;
    //     })=>lista!== null) 

    //     await update(listasInDb);
    // }

    const updateWithoutVendorLista = async ({withoutVendorLista}:{withoutVendorLista:Lista})=>{
        await update([{...withoutVendorLista,id:0}])
    }
    
    const cleanDuplicatedItemsOnDb = async ()=>{
        const currentListas = await getListas();
        const uniqueItems:string[] = [];
        const removeIds:number[] = [];
        Object.values(currentListas).forEach(lista=>{
            if(!uniqueItems.includes(lista.name))
            uniqueItems.push(lista.name);
            else
            removeIds.push(lista.id);
        })
        await remove(removeIds);
    }

    const getListas = ()=>getAll()

    const inListas = async ({name}:{name:string})=>{
        const currentListas = await getListas()
        return Object.values(currentListas).some((lista)=>lista.name === name);
    }

    return {saveListas,cleanDuplicatedItemsOnDb,getListas,inListas,updateWithoutVendorLista}
}