import { SelectField } from "@/types/FormFields"
import { Options } from "./Options";


export const Select:React.FC<SelectField> = ({optionList,fieldRef})=>{
    return <select ref={fieldRef}><Options optionList={optionList}/></select>
}