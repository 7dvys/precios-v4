'use client'

import { DbLista, Lista } from "@/types/Listas";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";
import { useEffect, useState } from "react";

export const useDbListas = ({inferedListas}:{inferedListas:Lista[]})=>{
    const [listas,setListas] = useState<DbLista[]>([])

    const initListas = async ()=>{
        const withoutVendorLista = inferedListas.find(({name})=>name === 'sin proveedor');
    
        const {addInferedListaToDbIfNotExist,cleanDuplicatedItemsOnDb,getListas,updateWithoutVendorLista} = await dbListasUtils()
        await addInferedListaToDbIfNotExist({inferedListas});
        await cleanDuplicatedItemsOnDb();
        if(withoutVendorLista)
        await updateWithoutVendorLista({withoutVendorLista})

        const newListas = await getListas() as DbLista[];

        setListas(newListas);
    }

    useEffect(()=>{initListas()},[])

    return {listas}
}