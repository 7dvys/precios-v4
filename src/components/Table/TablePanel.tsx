import tableStyles from '@/styles/tables.module.css';
import containerStyles from '@/styles/containers.module.css'
import { TablePanelProps } from "@/types/TableTypes";
import { getFilters } from "@/utils/tableComponent/getFilters";
import { getSearchableColumns } from "@/utils/tableComponent/getSearchableColumns";
import { passAllFilters } from "@/utils/tableComponent/passAllFilters";
import { passSearchFilter } from "@/utils/tableComponent/passSearchFilter";
import { useEffect, useMemo, useRef, useState } from "react";
import { TablePanelSearch } from './TablePanelSearch';
import { TablePanelPagination } from './TablePanelPagination';
import { TablePanelFilters } from './TablePanelFilters';
import { TablePanelInformation } from './TablePanelInformation';

export const TablePanel:React.FC<TablePanelProps> = ({columns,items,filteredItems,setFilteredItems,information})=>{
    const [pageSize,setPageSize]=useState<number>(100);
    const [pages,setPages] = useState<number>(Math.ceil(items.length/pageSize))
    const filters = useMemo(()=>getFilters({columns,items}),[items]);
    const searchableColumns = getSearchableColumns({columns});

    const searchRef = useRef<HTMLInputElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const paginationRef = useRef<HTMLInputElement>(null);
    
    const handlePanelChange = ()=>{
        const filters = (filtersRef.current as HTMLDivElement).childNodes as NodeListOf<HTMLSelectElement>;
        const search = (searchRef.current as HTMLInputElement).value;
        const pageValue = (paginationRef.current as HTMLInputElement).value;

        const newFilteredItems = items
            .filter(item=>passAllFilters({filters,item}))
            .filter(item=>passSearchFilter({searchableColumns,item,search}))

        const pages = Math.ceil(newFilteredItems.length/pageSize);

        let page = 1
        if(Number(pageValue)<=pages)
        page = Number(pageValue);
        else
        (paginationRef.current as HTMLInputElement).value = '1';
    
        const pageStart = pageSize*(page-1);
        const pageEnd = pageStart+pageSize;
        
        const newFilteredItemsSliced = newFilteredItems.slice(pageStart,pageEnd);
        
        setPages(pages);
        setFilteredItems(newFilteredItemsSliced);
    }
    
    useEffect(()=>{
        const pages = Math.ceil(items.length/pageSize);
        setPages(pages);
        handlePanelChange()
    },[pageSize,items])

    return (
        <div onChange={handlePanelChange} className={`${tableStyles.tablePanel} ${containerStyles.container}`}>
            <div className="flex-row flex-gap-m">
                <TablePanelSearch searchRef={searchRef} />
                <TablePanelPagination pages={pages} paginationRef={paginationRef} pageSize={pageSize} setPageSize={setPageSize} />
            </div>
            <TablePanelFilters filters={filters} filtersRef={filtersRef}/>
            <TablePanelInformation information={information}/>
        </div>
    )
}