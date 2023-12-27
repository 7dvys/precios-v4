import { TableItem } from "@/types/TableTypes";

export const passAllFilters = ({filters,item}:{filters:NodeListOf<HTMLSelectElement>,item:TableItem})=>{
    const filtersEntries = Array.from(filters).map((filter)=>({key:filter.name,value:filter.value}))

    return !filtersEntries.some(({key,value})=>{
        if(value === 'none')
        return false;
        
        const itemValues = Array.isArray(item[key])?item[key] as (string|number)[]:[item[key]];

        if(itemValues.length === 0) 
        return true;
    
        return !itemValues.some(itemValue=>
            itemValue === '*' || itemValue === value
        )
    })
}