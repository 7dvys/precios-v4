'use client'
import { useState } from "react";
import { TableItem, TableProps } from "@/types/TableTypes";
import { TablePanel } from "./TablePanel";
import { TableItems } from "./TableItems";

export const Table:React.FC<TableProps> = ({columns,items,groupFunctions,customStyles,panelInformation})=>{
    const maskPanelInformation = {elementos:items.length,...panelInformation}
    
    const [filteredItems,setFilteredItems] = useState<TableItem[]>(items);
    const [selectedItems,setSelectedItems] = useState<number[]>([]);
   
    return (
        <>
        <TablePanel filteredItems={filteredItems} information={maskPanelInformation} columns={columns} items={items} setFilteredItems={setFilteredItems} />
        <TableItems groupFunctions={groupFunctions} selectedItems={selectedItems} columns={columns} filteredItems={filteredItems} setSelectedItems={setSelectedItems}/>
        </>
    )
}




