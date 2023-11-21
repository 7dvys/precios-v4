import { ItemsTableProps } from "@/types/AgregarTypes";
import { TableColumn, TableItem, TableItemIdentifier, TablePanelInformation } from "@/types/TableTypes";
import { Table } from "../Table";
import { CSSProperties } from "react";
import { Product } from "@/types/Contabilium";
import { ListaItem } from "@/types/Listas";

const xlsxItemStyles:CSSProperties = {
   backgroundColor:'var(--grey-beige-1)'
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
    const itemsDictionary:Record<string,TableItemIdentifier> = {}; 

    const addToItemsDictionary = ({codigo,sku,index}:{codigo:string,sku:string|null,index:number})=>{
        itemsDictionary[index]={codigo,sku}
    }

    const [mainSerializedProducts,secondarySerializedProducts] = Object.values(products).map(accountProducts=>{
        return accountProducts.reduce((acc,product)=>{
            const sku = product.Codigo;
            acc[sku] = product
            return acc;
        },{} as Record<string,Product>)
    })

    const serializedProducts = {main:mainSerializedProducts,secondary:secondarySerializedProducts};
    const items:TableItem[] = sheetItems.flatMap(item=>{
        const newIndex = Object.keys(itemsDictionary).length;
        const itemRow ={id:newIndex,styles:xlsxItemStyles,...item,titulo:item.titulo||'sin titulo',tagsId:item.tagsId.join(',') || 'sin tags',cbItemSkus:genWithItemsFromCbItemSkus(item.cbItemSkus)}
        addToItemsDictionary({codigo:item.codigo,sku:null,index:newIndex});
        const cbItemRows = Object.entries(item.cbItemSkus).flatMap(([account,skus]:[string,string[]],index)=>{
            return skus.flatMap(sku=>{
                const cbItem:Product = serializedProducts[account as 'main'|'secondary'][sku];
                const itemRow ={
                    id:newIndex+index,
                    ...item,
                    costo:<><p>hola</p><br/><p>holaa</p></>,
                    codigo:sku,
                    titulo:(account === 'main'?'primaria':'secundaria')+': '+(cbItem.Nombre),
                    // titulo:account === 'main'?'primaria':'secundaria'+': '+('sin titulo'),
                    tagsId:item.tagsId.join(',') || 'sin tags',
                    cbItemSkus:genWithItemsFromCbItemSkus(item.cbItemSkus)
                }
                addToItemsDictionary({codigo:item.codigo,sku,index:newIndex+index})
                return itemRow;
            })
        })
        return [itemRow,...cbItemRows];
    });


    return <Table columns={columns} items={items} groupFunctions={groupFunctions}/>
} 