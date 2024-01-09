'use client'
import { isClient } from "@/constants/isClient";
import { ListaPageProps } from "@/types/ListaPageTypes";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";
import { useRouter } from "next/navigation";
import { LOCALHOST } from "@/constants/domain";
import { useEffect, useState } from "react";
import { DbLista } from "@/types/Listas";
import { useListas } from "@/hooks/useListas";
import { EditListaPanel } from "./EditListaPanel";
import { ItemsListaEditor } from "../ItemsListaEditor/ItemsListaEditor";

export const ListaPage:React.FC<ListaPageProps> =  ({listaId})=>{
    const router = useRouter()

    const [readOnly,setReadOnly] = useState<boolean>(true);
    const [currentLista,setCurrentLista] = useState<DbLista|undefined>(undefined)
    const {lista,setType,addTag,removeTag,saveLista,addSheet,updateListaItem,removeSheet,removeListaItem,removeListaItemSku,addListaItemSku,changeListaAllCosts} = useListas({initialLista:currentLista})  


    const initCurrentLista = async ()=>{
        const {getListas} = await dbListasUtils();
        const listas = await getListas();
    
        if(!(Number(listaId) in listas))
        router.replace(LOCALHOST+'/listas');
    
        const currentLista = listas[Number(listaId)];
        setCurrentLista(currentLista);
    }

    useEffect(()=>{
        initCurrentLista();
    },[])

    console.log(lista)

    if(!isClient)
    return;

    return (
        <>
            <EditListaPanel lista={lista} setType={setType} changeListaAllCosts={changeListaAllCosts} saveLista={saveLista} setReadOnly={setReadOnly} readOnly={readOnly}/>
            <ItemsListaEditor readOnly={readOnly} updateListaItem={updateListaItem} saveLista={saveLista} addListaItemSku={addListaItemSku} removeListaItem={removeListaItem} removeListaItemSku={removeListaItemSku} removeSheet={removeSheet} addSheet={addSheet} addTag={addTag} removeTag={removeTag} lista={lista}/>
        </>
    )

}