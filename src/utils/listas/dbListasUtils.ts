import { DATABASE } from "@/constants/database"
import { indexedDbUtils } from "../indexedDbUtils"
import {  Lista } from "@/types/Listas"

export const dbListasUtils =async ()=>{
    const {getAll,add,remove,update} = await indexedDbUtils<Lista>(DATABASE.OBJECTS_STORE.listas);

    const addInferedListaToDbIfNotExist = async ({inferedListas}:{ inferedListas: Lista[]})=>{
        const currentListas = await getListas()
        const listasNotInDb = inferedListas.filter(lista=>{
            const isInCurrentListas = Object.values(currentListas).some(({name})=>name===lista.name);
            if(!isInCurrentListas) 
            return lista
        })
        await add(listasNotInDb);
    }

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

    return {addInferedListaToDbIfNotExist,cleanDuplicatedItemsOnDb,getListas,inListas,updateWithoutVendorLista}
}