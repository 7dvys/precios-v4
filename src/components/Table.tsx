'use client'
import { Fragment, useEffect, useRef, useState } from "react";
import { Select } from "./Select";
import { Option } from "@/types/FormFields";
import { Filter, TableColumn, TableGroupFunction, TableItem, TableItemCheckboxProps, TableItemsHeaderCheckbox, TableItemsProps, TablePanelFiltersProps, TablePanelInformationProps, TablePanelPaginationProps, TablePanelProps, TablePanelSearchPros, TableProps } from "@/types/TableTypes";
import tableStyles from '@/styles/tables.module.css';
import containerStyles from '@/styles/containers.module.css'
import { Options } from "./Options";

// FUNCTIONS
const getFilters = ({columns,items}:{columns:TableColumn[],items:TableItem[]}):Filter[]=>{
    const filterableColumns = columns.filter(({filterable})=>filterable);

    const groupBy = ({keyColumn,items}:{keyColumn:string,items:TableItem[]})=>
    items.reduce((acc,item)=>{
        if(!acc.includes(item[keyColumn] as React.ReactNode))
        acc.push(item[keyColumn] as React.ReactNode)
        return acc
    },[] as React.ReactNode[])
    
    const filters = filterableColumns.map(({keyColumn,label})=>{
        const values:Option[] = groupBy({keyColumn,items}).map((value)=>({value} as {value:string}))
        return {keyColumn,values,label}
    }) 

    return filters;
}

const getSearchableColumns = ({columns}:{columns:TableColumn[]})=>{
    return columns.filter(({searchable})=>searchable).map(filter=>filter.keyColumn);
}

const passAllFilters = ({filters,item}:{filters:NodeListOf<HTMLSelectElement>,item:TableItem})=>{
    const filtersEntries = Array.from(filters).map((filter)=>({key:filter.name,value:filter.value}))
    return !filtersEntries.some(({key,value})=>
        value === 'none'?false:item[key] !== value
    )
}

const passSearchFilter = ({search,searchableColumns,item}:{search:string,searchableColumns:string[],item:TableItem})=>{
    console
    return searchableColumns.some(keyColumn=>
        (item[keyColumn] as string|number).toString().toUpperCase().includes(search.toUpperCase())
    )
}
// END FUNCTIONS

// COMPONENTS
export const Table:React.FC<TableProps> = ({columns,items,groupFunctions,customStyles,panelInformation})=>{
    const maskPanelInformation = {elementos:items.length,...panelInformation}
    
    const [filteredItems,setFilteredItems] = useState<TableItem[]>(items);
    const [selectedItems,setSelectedItems] = useState<number[]>([]);
   
    return (
        <>
        <TablePanel information={maskPanelInformation} columns={columns} items={items} setFilteredItems={setFilteredItems} />
        <TableItems groupFunctions={groupFunctions} selectedItems={selectedItems} columns={columns} items={filteredItems} setSelectedItems={setSelectedItems}/>
        </>
    )
}

const TablePanel:React.FC<TablePanelProps> = ({columns,items,setFilteredItems,information})=>{
    const [pageSize,setPageSize]=useState<number>(100);
    const [pages,setPages] = useState<number>(Math.ceil(items.length/pageSize))
    const filters = getFilters({columns,items});
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

// TablePanelSearch
const TablePanelSearch:React.FC<TablePanelSearchPros> = ({searchRef})=>(
    <div>
        <input ref={searchRef} name="search" type="text" placeholder="buscar"/>
    </div>
)

// TablePanelFilter
const TablePanelFilter:React.FC<Filter> = ({keyColumn,values,label})=>(
    <select name={keyColumn} id="">
        <option value="none">{label || keyColumn}</option>
        <Options optionList={values}/>
    </select>
)


const TablePanelFilters:React.FC<TablePanelFiltersProps> = ({filters,filtersRef})=>(
    <div ref={filtersRef}>
        {filters.map((filter,index)=><Fragment key={index}><TablePanelFilter {...filter}/></Fragment>)}
    </div>
)

const TablePanelPagination:React.FC<TablePanelPaginationProps> = ({paginationRef,pageSize,setPageSize,pages})=>{
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

const TablePanelInformation:React.FC<TablePanelInformationProps> = ({information})=>{
    if(information)
    return (
        <div className="flex-row">
            {Object.entries(information).map(([key,value],index)=>{
                return <span key={index}>{key}:{value}</span>
            })}
        </div>
    )
    else 
    return null;
}

const TableItemCheckbox:React.FC<TableItemCheckboxProps> = ({item,setSelectedItems,selectedItems})=>{
    const isChecked = selectedItems.some(itemId=>itemId===item.id);
    const clickHandler = ()=>{
        setSelectedItems(selectedItems=>{
            if(isChecked){
                const newSelectedItems = selectedItems.filter(itemId=>itemId!==item.id);
                return newSelectedItems;
            }
            else{
                return [...selectedItems,item.id];
            }
        })
    }
    return <input type="checkbox" onClick={clickHandler} checked={isChecked} readOnly/>
}

const TableItemHeaderCheckbox:React.FC<TableItemsHeaderCheckbox> = ({selectedItems,setSelectedItems,groupFunctions})=>{
    if(!groupFunctions)
    return;
    
    const withCheckedItems = selectedItems.length>0;

    const clearSelections = ()=>{
        withCheckedItems && setSelectedItems([]);
    }

    const groupFunctionsOptionList:Option[] = groupFunctions.map(({label})=>({value:label}))
    const clearSelectionsOption:Option = {value:'clearSelections',title:'Limpiar'};
    
    const groupFunctionHandler = (event:React.MouseEvent<HTMLSelectElement>)=>{
        const {localName} = (event.target as HTMLSelectElement|HTMLOptionElement);
        if(localName !== 'select'){
            const functionName = (event.target as HTMLOptionElement).value

            if(functionName === 'none')
            return;

            if(functionName === 'clearSelections')
            return clearSelections()
         
            const groupFunction = (groupFunctions.find(({label})=>label===functionName) as TableGroupFunction).functionHandler;
            groupFunction(selectedItems);
            return clearSelections()
        }

    }
    
    return <select onClick={groupFunctionHandler} onChange={()=>{}} value={'none'} name="groupFunction"><Options optionList={[clearSelectionsOption,...groupFunctionsOptionList]} placeholder="Accion"/></select>
}


const TableItems:React.FC<TableItemsProps> = ({columns,items,setSelectedItems,selectedItems,groupFunctions})=>{
    const renderCheckboxes = groupFunctions !== undefined;
    const visibleColumns = columns.filter(({visible})=>visible!== false).map(({keyColumn})=>keyColumn);
    const isVisibleColumn = (keyColumn:string)=>visibleColumns.some(visibleKeyColumn=>keyColumn===visibleKeyColumn);
    
    if(items.length)
    return (
        <div className={`${containerStyles.container}`}>
            <table className={`${tableStyles.tableItems}`}>
                <thead>
                    <tr>
                        {renderCheckboxes && <th className={tableStyles.checkBoxCol}><TableItemHeaderCheckbox groupFunctions={groupFunctions} setSelectedItems={setSelectedItems} selectedItems={selectedItems}/></th>}
                        {columns.map(({keyColumn,label})=>
                            <>{isVisibleColumn(keyColumn) && <th key={keyColumn}>{label}</th>}</>
                        )}
                    </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                <Fragment key={index}>
                    <tr style={item.styles}>
                        {
                            renderCheckboxes && 
                            <td className={tableStyles.checkBoxCol} key={'checkbox' + index}>
                                <TableItemCheckbox item={item} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />
                            </td>
                        }
                        
                        {Object.entries(item).map(([key, value]) => 
                            isVisibleColumn(key) && <td key={key}>{((value === 'string' && (value as string).trim()) || value) as React.ReactNode}</td>
                        )}
                    </tr>
                </Fragment>
            ))}

                </tbody>
            </table>
        </div>

    )
    else
    return (
        <div className={containerStyles.container}>
            Sin elementos...
        </div>
    )
}



