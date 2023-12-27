import { Filter } from "@/types/TableTypes";
import { Options } from "../Options";

export const TablePanelFilter:React.FC<Filter> = ({keyColumn,values,label})=>(
    <select name={keyColumn} id="">
        <option value="none">{label || keyColumn}</option>
        <Options optionList={values}/>
    </select>
)