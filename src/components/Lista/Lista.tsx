import { ItemsListaEditor } from "../ItemsListaEditor/ItemsListaEditor"
import { useListas } from "@/hooks/useListas"
import { ListaProps } from "@/types/ListaPageTypes"
import { useState } from "react"

export const Lista:React.FC<ListaProps> = async ({lista:currentLista,tokens,rubrosWithSubRubros,cotizaciones,products})=>{
    const [readOnly,setReadOnly] = useState<boolean>(true)
    const {lista,setNameVendorAndType,addTag,removeTag,addSheet,removeSheet,removeListaItem,removeListaItemSku,addListaItemSku} = useListas({initialLista:currentLista})  
    
    return (
        <>
            <ItemsListaEditor tokens={tokens} readOnly={readOnly} rubrosWithSubRubros={rubrosWithSubRubros} addListaItemSku={addListaItemSku} removeListaItem={removeListaItem} removeListaItemSku={removeListaItemSku} removeSheet={removeSheet} addSheet={addSheet} addTag={addTag} removeTag={removeTag} lista={lista} cotizaciones={cotizaciones} products={products}/>
        </>
    )
}