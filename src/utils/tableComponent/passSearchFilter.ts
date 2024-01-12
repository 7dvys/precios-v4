import { TableItem } from "@/types/TableTypes";

export const passSearchFilter = ({search,searchableColumns,item}:{search:string,searchableColumns:string[],item:TableItem})=>{
    return searchableColumns.some(key=>{
        const itemValues = Array.isArray(item[key])?item[key] as (string|number)[]:[item[key]];
        return itemValues.some(itemValue=>{
            if(search === '' || search === undefined || search === null)
            return true;
            
            if(itemValue === undefined || itemValue === null || itemValue === '')
            return false;

            if(typeof itemValue === 'string' || typeof itemValue === 'number')
            return itemValue.toString().toUpperCase().includes(search.toUpperCase())

            return false;
        }
            
        )   
    })
}