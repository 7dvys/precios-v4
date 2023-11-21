import { DATABASE } from "@/constants/database"
import { indexedDbUtils } from "../indexedDbUtils"
import { Lista } from "@/types/Listas"

export const listasUtils =async ()=>{
    const {getAll,add,remove} = await indexedDbUtils<Lista>(DATABASE.OBJECTS_STORE.listas);

    const addInferedListaToDbIfNotExist = async ({inferedListas}:{ inferedListas: Lista[]})=>{
        const currentListas = await getListas()
        const listasNotInDb = inferedListas.filter(lista=>{
            const isInCurrentListas = currentListas.some(({titulo})=>titulo===lista.titulo);
            if(!isInCurrentListas) 
            return lista
        })
        await add(listasNotInDb);
    }
    
    const cleanDuplicatedItemsOnDb = async ()=>{
        const currentListas = await getListas();
        const uniqueItems:string[] = [];
        const removeIds:number[] = [];
        currentListas.forEach(lista=>{
            if(!uniqueItems.includes(lista.titulo))
            uniqueItems.push(lista.titulo);
            else
            removeIds.push(lista.id);
        })
        await remove(removeIds);
    }

    const getListas = ()=>getAll()

    const inListas = async ({titulo}:{titulo:string})=>{
        const currentListas = await getListas()
        return currentListas.some((lista)=>lista.titulo === titulo);
    }

    return {addInferedListaToDbIfNotExist,cleanDuplicatedItemsOnDb,getListas,inListas}
}