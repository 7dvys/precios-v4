import { TablePanelFiltersProps } from "@/types/TableTypes";
import { Fragment } from "react";
import { TablePanelFilter } from "./TablePanelFilter";

export const TablePanelFilters:React.FC<TablePanelFiltersProps> = ({filters,filtersRef})=>(
    <div ref={filtersRef}>
        {filters.map((filter,index)=><Fragment key={index}><TablePanelFilter {...filter}/></Fragment>)}
    </div>
)