import { ItemsTableProps } from "@/types/AgregarTypes";
import { TableColumn } from "@/types/TableTypes";
import { Table } from "../Table";
import { itemsTableColumns } from "@/constants/itemsTableColumns";

export const ItemsTable:React.FC<ItemsTableProps> = ({tableItems,groupFunctions})=>{
    const columns:TableColumn[] = itemsTableColumns;   
    return <Table columns={columns} items={tableItems} groupFunctions={groupFunctions}/>
} 