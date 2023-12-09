'use client'

import { Lista, ListaItem } from "@/types/Listas";
import { Table } from "@/components/Table";
import { TableColumn, TablePanelInformation } from "@/types/TableTypes";
import Link from "next/link";
import { PenIcon } from "@/components/icons/Pen";
import { isClient } from "@/constants/isClient";
import { useDbListas } from "@/hooks/useDbListas";

export const ListasPage:React.FC<{inferedListas:Lista[]}> =({inferedListas})=>{
    if(!isClient)
    return;

    const {listas} = useDbListas({inferedListas})

    if(listas.length === 0)
    return;

    const modificarLink:React.FC<{id:number}> = ({id})=><Link href={'/listas/'+id}> {PenIcon} </Link> 
    const columns:TableColumn[] = [
        {keyColumn:'name',label:'titulo',searchable:true,filterable:false},
        {keyColumn:'vendor',label:'proveedor',searchable:false,filterable:true},
        {keyColumn:'items',label:'items',searchable:false,filterable:false},
        {keyColumn:'type',label:'tipo',searchable:false,filterable:true},
        {keyColumn:'modificar',label:'',searchable:false,filterable:false},
    ]

    const items = Object.values(listas).map(({vendor,name,items,type,id})=>({
        id,
        name,
        vendor,
        items:items.length,
        type:type==='main'?'principal':type==='both'?'ambas':'secundaria',
        modificar:modificarLink({id})
    }));

    const totalItems = inferedListas.reduce((acc,lista)=>{
        const listaItems:ListaItem[] = lista.items
        const listaItemsSkuCount = listaItems.reduce((acc,listaItem)=>{
            const {main,secondary} = listaItem.cbItemSkus
            const count = main.length+secondary.length;
            const newAcc = acc+count;
            return newAcc;
        },0)
        const newAcc = acc+listaItemsSkuCount
        return newAcc;
    },0)
    
    const panelInformation:TablePanelInformation = {'items totales':totalItems}

    return (
        <div className="flex-column flex-gap-m">
            <Table columns={columns} items={items} panelInformation={panelInformation}/>
        </div>
    )
}