import { TableItem } from "@/types/TableTypes";

export const passSearchFilter = ({search,searchableColumns,item}:{search:string,searchableColumns:string[],item:TableItem})=>{
    return searchableColumns.some(key=>{
        const itemValues = Array.isArray(item[key])?item[key] as (string|number)[]:[item[key]];
        return itemValues.some(itemValue=>
            (itemValue as string|number).toString().toUpperCase().includes(search.toUpperCase())
        )   
    })
}