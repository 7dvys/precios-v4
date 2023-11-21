import { SelectField } from "@/types/FormFields"
import { Options } from "./Options";


export const Select:React.FC<SelectField> = ({name,optionList,fieldRef,placeholder,disabled})=>{
    return (
        <select disabled={disabled} name={name} ref={fieldRef}>
            <Options optionList={optionList} placeholder={placeholder}/>
        </select>
    ) 
} 