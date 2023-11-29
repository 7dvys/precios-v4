'use client'
import { isClient } from '@/constants/isClient';
import { cotizacionesUtils } from '@/utils/cotizaciones/cotizacionesUtils';
import { AgregarPageProps,  } from '@/types/AgregarTypes';
import { ListaFields } from './ListaFields';
import { TagsEditor } from "../TagsEditor";
import { useListas } from "@/hooks/useListas";
import { ItemsListaEditor } from '../ItemsListaEditor/ItemsListaEditor';

export const AgregarPage:React.FC<AgregarPageProps> = ({vendors,products,cotizacionesUtilsDependencies})=>{
    if(!isClient)
    return;

    const {getCotizaciones} = cotizacionesUtils(cotizacionesUtilsDependencies);
    const cotizaciones = getCotizaciones();

    const {lista,setNameVendorAndType,addTag,removeTag,addSheet,removeSheet,removeListaItem,removeListaItemSku} = useListas({})  

    return (
        <div className='flex-column flex-gap-m'>
            <ListaFields setNameVendorAndType={setNameVendorAndType} vendors={vendors} />
            <ItemsListaEditor readOnly={false} removeListaItem={removeListaItem} removeListaItemSku={removeListaItemSku} removeSheet={removeSheet} addSheet={addSheet} addTag={addTag} removeTag={removeTag} lista={lista} cotizaciones={cotizaciones} products={products}/>
        </div>
    )
}