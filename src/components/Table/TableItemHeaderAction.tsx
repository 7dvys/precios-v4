import { Option } from "@/types/FormFields";
import { TableItemsHeaderCheckbox } from "@/types/TableTypes";
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

    const customFunctionsOptionList:Option[] = groupFunctions.map(({label})=>({value:label,title:label}))
    const defaultFunctionsOptionList:Option[] = [
        {value:'clearSelections',title:'Limpiar'},
        {value:'selectAllPageItems',title:'Seleccionar pagina'},
    ]

    const groupFunctionsOptionList = [...defaultFunctionsOptionList,...customFunctionsOptionList];

    
    const groupFunctionHandler = (event:React.ChangeEvent<HTMLSelectElement>)=>{
    
        const functionName = (event.target as HTMLSelectElement).value;

        (event.target as HTMLSelectElement).value = 'none';

        if(functionName === 'clearSelections')
        return clearSelections();

        if(functionName === 'selectAllPageItems')
        return selectAllPageItems();
        
        const groupFunction = groupFunctions.find(({label})=>label===functionName);

        if(groupFunction !== undefined && 'functionHandler' in groupFunction)
        return groupFunction.functionHandler(selectedItems,clearSelections);

    }
    

    return <select onChange={groupFunctionHandler} name="groupFunction"><Options optionList={groupFunctionsOptionList} placeholder="Accion"/></select>
}