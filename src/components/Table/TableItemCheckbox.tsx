import { TableItemCheckboxProps } from "@/types/TableTypes";

export const TableItemCheckbox:React.FC<TableItemCheckboxProps> = ({item,selectItem,isChecked})=>{
    const clickHandler = ()=>{
        selectItem({item});
    }
    return <input type="checkbox" onClick={clickHandler} checked={isChecked} readOnly/>
}
