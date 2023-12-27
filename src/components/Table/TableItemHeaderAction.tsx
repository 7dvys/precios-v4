import { Option } from "@/types/FormFields";
import { TableGroupFunction, TableItemsHeaderCheckbox } from "@/types/TableTypes";
import { Options } from "../Options";

export const TableItemHeaderAction:React.FC<TableItemsHeaderCheckbox> = ({filteredItems,selectedItems,setSelectedItems,groupFunctions})=>{
    if(!groupFunctions)
    return;
    
    const withCheckedItems = selectedItems.length>0;

    const clearSelections = ()=>{
        withCheckedItems && setSelectedItems([]);
    }

    const getPageItemsIds = ()=>{
        return filteredItems.map(({id})=>id);
    }

    const selectAllPageItems = ()=>{
        const pageItemsIds = getPageItemsIds();

        setSelectedItems(currentSelectedItems=>{
            const pageItemsIdsWithoutCurrentSelecetdITems = pageItemsIds.filter(pageItemId=>{
                const pageItemIdInCurrentSelectedItems = currentSelectedItems.some(id=>pageItemId === id);
                return !pageItemIdInCurrentSelectedItems;
            })

            return [...currentSelectedItems,...pageItemsIdsWithoutCurrentSelecetdITems];
        })
    }

    const customFunctionsOptionList:Option[] = groupFunctions.map(({label})=>({value:label}))
    const defaultFunctionsOptionList:Option[] = [
        {value:'clearSelections',title:'Limpiar'},
        {value:'selectAllPageItems',title:'Seleccionar pagina'},
    ]

    const groupFunctionsOptionList = [...defaultFunctionsOptionList,...customFunctionsOptionList];

    
    const groupFunctionHandler = (event:React.MouseEvent<HTMLSelectElement>)=>{
        const {localName} = (event.target as HTMLSelectElement|HTMLOptionElement);
        if(localName !== 'select'){
            const functionName = (event.target as HTMLOptionElement).value

            if(functionName === 'none')
            return;

            if(functionName === 'clearSelections')
            return clearSelections()

            if(functionName === 'selectAllPageItems')
            return selectAllPageItems()
         
            const groupFunction = (groupFunctions.find(({label})=>label===functionName) as TableGroupFunction).functionHandler;
            groupFunction(selectedItems);

            // return clearSelections()
        }

    }
    
    return <select onClick={groupFunctionHandler} onChange={()=>{}} value={'none'} name="groupFunction"><Options optionList={groupFunctionsOptionList} placeholder="Accion"/></select>
}