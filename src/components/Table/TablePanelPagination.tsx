import { TablePanelPaginationProps } from "@/types/TableTypes"

import tableStyles from '@/styles/tables.module.css';

export const TablePanelPagination:React.FC<TablePanelPaginationProps> = ({paginationRef,pageSize,setPageSize,pages})=>{
    const handleClickPageSize = ()=>{
        const newPageSize = Number(prompt('nuevo tamaño de pagina:',pageSize.toString()))
        if(!isNaN(newPageSize) && newPageSize)
        setPageSize(newPageSize)
    }
    
    return (
    <div>
        <label title="modifica el tamaño de pagina." className={tableStyles.pageSize} onClick={handleClickPageSize} htmlFor="page">pagina</label>
        <input ref={paginationRef} className={tableStyles.pageInput} type="number" name="page" id="page" onKeyDown={(event)=>{event.preventDefault()}} defaultValue={1} min={1} max={pages}/>
        {' '}de {pages}
    </div>
    )
}