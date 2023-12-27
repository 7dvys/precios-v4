import { Option } from "@/types/FormFields";
import { TableGroupFunction, TableItemsHeaderCheckbox } from "@/types/TableTypes";
import { Options } from "../Options";
import styles from '@/styles/tableItemHeaderAction.module.css'

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
    // const groupFunctionHandler = (functionName:string)=>{
    
        const functionName = (event.target as HTMLSelectElement).value
        // if(functionName === 'none')
        // return;

        if(functionName === 'clearSelections')
         clearSelections();

        if(functionName === 'selectAllPageItems')
         selectAllPageItems();
        
        const groupFunction = groupFunctions.find(({label})=>label===functionName);
        if(groupFunction !== undefined && 'functionHandler' in groupFunction)
        groupFunction.functionHandler(selectedItems);

        (event.target as HTMLSelectElement).value = 'none';

            // return clearSelections()

    }
    
    // return (
    //     <div className={styles.contenedor}>
    //         <input type="button" className={styles.accion} value="accion" />
    //         <div className={`flex-column ${styles.acciones}`}>
    //             {groupFunctionsOptionList.map(({value,title},index)=>
    //                 <div className={`button` } key={index} onClick={()=>{groupFunctionHandler(value as string)}}>{title}</div>
    //                 )}
    //         </div>
    //         {/* <input type="button" className={styles.acciones} value="acciones" /> */}

    //         {/* <div className={styles.acciones}>acciones</div> */}
    //     </div>
    // )
    return <select onChange={groupFunctionHandler} name="groupFunction"><Options optionList={groupFunctionsOptionList} placeholder="Accion"/></select>
}