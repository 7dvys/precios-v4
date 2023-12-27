import { TablePanelSearchProps } from "@/types/TableTypes";

export const TablePanelSearch:React.FC<TablePanelSearchProps> = ({searchRef})=>(
    <div>
        <input ref={searchRef} name="search" type="text" placeholder="buscar"/>
    </div>
)