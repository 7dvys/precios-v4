import { TableColumn } from "@/types/TableTypes";

export const getSearchableColumns = ({columns}:{columns:TableColumn[]})=>{
    return columns.filter(({searchable})=>searchable).map(filter=>filter.keyColumn);
}