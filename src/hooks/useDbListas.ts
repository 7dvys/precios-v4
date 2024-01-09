'use client'

import { isClient } from "@/constants/isClient";
import { DbLista, Lista } from "@/types/Listas";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";
import { useEffect, useState } from "react";

export const useDbListas = ({inferedListas}:{inferedListas:Lista[]})=>{
    const [listas,setListas] = useState<Record<number,DbLista>>([])

    const initListas = async ()=>{
        if(!isClient)
        return;
        // const withoutVendorLista = inferedListas.find(({name})=>name === 'sin proveedor');
    
        const {cleanDuplicatedItemsOnDb,getListas,saveListas} = await dbListasUtils()
        await saveListas({listas:inferedListas})
        await cleanDuplicatedItemsOnDb();

        const newListas = await getListas() as Record<number,DbLista>;

        setListas(newListas);
    }

    useEffect(()=>{initListas()},[])

    return {listas}
}