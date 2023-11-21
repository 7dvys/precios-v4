'use client'
import { useEffect, useMemo, useState } from "react";
import { Lista, ListaItem, Tag } from '@/types/Listas';
import { isClient } from '@/constants/isClient';
import * as XLSX from 'xlsx';
import { cotizacionesUtils } from '@/utils/cotizaciones/cotizacionesUtils';
import { AgregarPageProps, XlsxListaItems } from '@/types/AgregarTypes';
import { ListaFields } from './ListaFields';
import { ItemsFields } from './ItemsFields';
import { ItemsTable } from './ItemsTable';
import { TableGroupFunction } from "@/types/TableTypes";
import { genResultingItems } from "@/utils/agregarUtils";
import { TagsPanel } from "./TagsPanel";
import { LOCALHOST } from "@/constants/domain";

export const AgregarPage:React.FC<AgregarPageProps> = ({vendors,products,cotizacionesUtilsDependencies})=>{
    if(!isClient)
    return;

    const {getCotizaciones} = cotizacionesUtils(cotizacionesUtilsDependencies);
    
    const initialLista:Omit<Lista,'id'> = {
        titulo:'', //
        proveedor:'', //
        proveedorId:0, //
        tags:[],
        items:[],
        type:'both'
    } 

    const [lista,setLista] = useState<Lista>(initialLista as Lista);
    const exampleTags = [{
        id: 'tag ex',
        descripcion: 'este tag es de ejemplo ejje bueno pongamos mas y mas y mas',
        fijo: 300,
        porcentual: 10
    },{
        id: 'tag ex',
        descripcion: 'este tag es de ejemplo ejje bueno pongamos mas y mas y mas',
        fijo: 300,
        porcentual: 10
    },{
        id: 'tag x',
        descripcion: 'este tag es de ejemplo ejje bueno pongamos mas y mas y mas',
        fijo: 300,
        porcentual: 10
    }]

    const [tags,setTags] = useState<Tag[]>(exampleTags);
    const [xlsxWorkbook,setXlsxWorkbook] = useState<XLSX.WorkBook>({SheetNames:['none']} as XLSX.WorkBook);
    const [xlsxSheetItems,setXlsxSheetItems] = useState<ListaItem[]>([]);

    const [xlsxListaItemsList,setXlsxListaItemsList] = useState<XlsxListaItems[]>([]);

    const renderItemsFields = lista.titulo && lista.proveedor && lista.proveedorId && lista.type;

    const groupFunctions:TableGroupFunction[] = [{label:'console log',functionHandler:(ids)=>{console.log(ids)}}]

    const resultingItems = useMemo(()=>genResultingItems(xlsxSheetItems,xlsxListaItemsList),[xlsxSheetItems,xlsxListaItemsList])
    useEffect(()=>{console.log(resultingItems)},[xlsxListaItemsList])
    const renderItemsTable = (resultingItems.length > 0) ;

    return (
        <div className='flex-column flex-gap-m'>
            <ListaFields setLista={setLista} vendors={vendors} />
            {renderItemsFields && <ItemsFields xlsxSheetItems={xlsxSheetItems} xlsxListaItemsList={xlsxListaItemsList} setXlsxListaItemsList={setXlsxListaItemsList} cotizaciones={getCotizaciones()} products={products} setXlsxSheetItems={setXlsxSheetItems} setXlsxWorkbook={setXlsxWorkbook} xlsxWorkbook={xlsxWorkbook}/>}
            {renderItemsFields && <TagsPanel tags={tags} setTags={setTags} inferedTags={[]}/>}
            {renderItemsTable && <ItemsTable products={products} sheetItems={resultingItems} groupFunctions={groupFunctions}/>}
        </div>
    )
}