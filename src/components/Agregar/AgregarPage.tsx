'use client'
import { ListaFields } from './ListaFields';
import { useListas } from "@/hooks/useListas";
import { ItemsListaEditor } from '../ItemsListaEditor/ItemsListaEditor';
import { useContext, } from 'react';
import { ContabiliumContext } from '@/contexts/ContabiliumContext';

export const AgregarPage:React.FC = ()=>{
    const {vendors} = useContext(ContabiliumContext)
    const {lista,setNameVendorAndType,addTag,removeTag,addSheet,updateListaItem,removeSheet,removeListaItem,saveLista,removeListaItemSku,addListaItemSku} = useListas({})  

    return (
        <div className='flex-column flex-gap-m'>
            <ListaFields lista={lista} setNameVendorAndType={setNameVendorAndType} vendors={vendors} />
            <ItemsListaEditor updateListaItem={updateListaItem} saveLista={saveLista} readOnly={false}  addListaItemSku={addListaItemSku} removeListaItem={removeListaItem} removeListaItemSku={removeListaItemSku} removeSheet={removeSheet} addSheet={addSheet} addTag={addTag} removeTag={removeTag} lista={lista}/>
        </div>
    )
}