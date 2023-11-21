import { ItemsTableProps } from "@/types/AgregarTypes";
import { TableColumn, TableItem, TableItemIdentifier, TablePanelInformation } from "@/types/TableTypes";
import { Table } from "../Table";
import { CSSProperties } from "react";
import { Product } from "@/types/Contabilium";

const xlsxItemStyles:CSSProperties = {
    backgroundColor:'red'
}

export const ItemsTable:React.FC<ItemsTableProps> = ({sheetItems,groupFunctions,products})=>{
    const columns:TableColumn[] = [
        {keyColumn:'codigo',label:'codigo',searchable:true,filterable:false},
        {keyColumn:'titulo',label:'titulo',searchable:true,filterable:false},
        {keyColumn:'costo',label:'costo',searchable:false,filterable:false},
        {keyColumn:'iva',label:'iva',searchable:false,filterable:false},
        {keyColumn:'rentabilidad',label:'rentabilidad',searchable:false,filterable:false},
        {keyColumn:'cotizacion',label:'cotizacion',searchable:false,filterable:true},
        {keyColumn:'tagsId',label:'tags',searchable:false,filterable:true},
        {keyColumn:'cbItemSkus',label:'items',searchable:false,filterable:true}
    ]

    const genWithItemsFromCbItemSkus = (cbItemSkus: {
        main: string[];
        secondary: string[];
    })=>{
        const mainItems = (cbItemSkus.main.length > 0 && 1) || 0;
        const secondaryItems = (cbItemSkus.secondary.length > 0 && 2) || 0;
        const result = mainItems+secondaryItems;
        return result===0?'sin items':result === 1?'primaria':result=== 2?'secundaria':'ambas';
    }
    const itemsDictionary:TableItemIdentifier[] = []; 

    const serializedProducts = Object.values(products).map(accountProducts=>{
        return accountProducts.reduce((acc,product)=>{
            const sku = product.Codigo;
            acc[sku] = product
            return acc;
        },{} as Record<string,Product>)
    })
    const items:TableItem[] = sheetItems.flatMap(item=>{
        const index = itemsDictionary.length-1;
        const itemRow ={id:index,styles:xlsxItemStyles,...item,titulo:item.titulo||'sin titulo',tagsId:item.tagsId.join(',') || 'sin tags',cbItemSkus:genWithItemsFromCbItemSkus(item.cbItemSkus)}
        const cbItemRows = Object.entries(item.cbItemSkus).flatMap(([account,skus]:[string,string[]])=>{
            // return skus.flatMap(sku=>)
        })
        return [itemRow];
    });

    return <Table columns={columns} items={items} groupFunctions={groupFunctions}/>
} 