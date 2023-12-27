import { Option } from "@/types/FormFields";
import { Filter, TableColumn, TableItem } from "@/types/TableTypes";

export const getFilters = ({columns,items}:{columns:TableColumn[],items:TableItem[]}):Filter[]=>{
    const filterableColumns = columns.filter(({filterable})=>filterable);

    const groupBy = ({keyColumn,items}:{keyColumn:string,items:TableItem[]})=>
    items.reduce((acc,item)=>{
        const itemValues = Array.isArray(item[keyColumn])?item[keyColumn] as (string|number)[]:[item[keyColumn]]
        
        if(itemValues.length ===0 || (itemValues.length ===1 && itemValues[0] === ''))
        return acc;
        
        itemValues.forEach(itemValue=>{
            if(itemValue === '')
            return acc;
            
            if(itemValue !== '*' && !acc.includes(itemValue as React.ReactNode))
            acc.push(itemValue as React.ReactNode)
        })
        return acc
    },[] as React.ReactNode[])
    
    const filters = filterableColumns.map(({keyColumn,label})=>{
        const values:Option[] = groupBy({keyColumn,items}).map((value)=>({value} as {value:string}))
        return {keyColumn,values,label}
    }) 

    return filters;
}