import { DATABASE } from "@/constants/database"
import { indexedDbUtils } from "../indexedDbUtils"
import {  Lista } from "@/types/Listas"
import { serializeListaItems } from "./serializeListaItems";

export const dbListasUtils =async ()=>{
    const {getAll,add,remove,update} = await indexedDbUtils<Lista>(DATABASE.OBJECTS_STORE.listas);

    const addListaIfNotExist = async ({listas}:{ listas: Lista[]})=>{
        const currentListas = await getListas()
        const listasNotInDb = listas.filter(lista=>{
            const isInCurrentListas = Object.values(currentListas).some(({name})=>name===lista.name);
            return !isInCurrentListas
        })
        if(listasNotInDb.length>0)
        await add(listasNotInDb);
    }

    const saveListas = async ({listas}:{listas:Lista[]})=>{
        const currentListas = await getListas();
        listas.forEach(lista=>{
            const listaInCurrentListas = Object.values(currentListas).find(({name})=>name===lista.name);
            if(listaInCurrentListas === undefined)
            return add([lista]);
            const listaInCurrentListasSerializedItems = serializeListaItems({listaItems:listaInCurrentListas.items})
            const listasSerializedItems = serializeListaItems({listaItems:lista.items})

            const newListaItems = Object.values({...listaInCurrentListasSerializedItems,...listasSerializedItems}); 

            return update([{...listaInCurrentListas,...lista,items:newListaItems}]);
        })
    }

    const updateListas = async ({listas}:{ listas: Lista[]})=>{
        const currentListas = await getListas()
        const listasInDb = listas.map(lista=>{
            const listaInCurrentListas = Object.values(currentListas).find(({name})=>name===lista.name);
            if(listaInCurrentListas === undefined)
            return null

            return {...listaInCurrentListas,...lista};
        })
        .filter((lista):lista is (Lista & {
            id: number;
        })=>lista!== null) 

        await update(listasInDb);
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

    return {addListaIfNotExist,updateListas,saveListas,cleanDuplicatedItemsOnDb,getListas,inListas,updateWithoutVendorLista}
}