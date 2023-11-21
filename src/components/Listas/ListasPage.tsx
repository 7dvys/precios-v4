'use client'

import { Lista } from "@/types/Listas";
import { Table } from "@/components/Table";
import { TableColumn, TableItem } from "@/types/TableTypes";
import Link from "next/link";
import { PenIcon } from "@/components/icons/Pen";
import { isClient } from "@/constants/isClient";
import { listasUtils } from "@/utils/listas/listasUtils";



const initListas = async ({inferedListas}:{inferedListas:Lista[]})=>{
    const {addInferedListaToDbIfNotExist,cleanDuplicatedItemsOnDb,getListas} = await listasUtils()
    await addInferedListaToDbIfNotExist({inferedListas});
    await cleanDuplicatedItemsOnDb();
    return await getListas();
}

export const ListasPage:React.FC<{inferedListas:Lista[]}> = async ({inferedListas})=>{
    if(!isClient)
    return;

    const listas = await initListas({inferedListas});
    const modificarLink:React.FC<{id:number}> = ({id})=><Link href={'/listas/'+id}> {PenIcon} </Link> 
    const columns:TableColumn[] = [
        {keyColumn:'titulo',label:'titulo',searchable:true,filterable:false},
        {keyColumn:'proveedor',label:'proveedor',searchable:false,filterable:true},
        {keyColumn:'items',label:'items',searchable:false,filterable:false},
        {keyColumn:'type',label:'tipo',searchable:false,filterable:true},
        {keyColumn:'modificar',label:'',searchable:false,filterable:false},
    ]

    const items:TableItem[] = listas.map(({proveedor,titulo,items,type,id},index)=>({
        id:id??index,
        titulo,
        proveedor,
        items:items.length,
        type:type==='main'?'principal':type==='both'?'ambas':'secundaria',
        modificar:modificarLink({id:id??index})
    }));

    return (
        <div className="flex-column flex-gap-m">
            <Table columns={columns} items={items} withCheckboxes={false}/>
        </div>
    )
}