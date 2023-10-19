import { InputField } from "@/types/FormFields"
import { Options } from "./Options"

export const Input:React.FC<InputField> = ({name,type,placeholder,optionList,fieldRef})=>{
    return (
        <>
            <datalist id={name}><Options optionList={optionList}/></datalist>
            <input ref={fieldRef} list={name} name={name} min={type=='positiveNumber'?0:undefined} type={type} placeholder={placeholder}/>
        </>
    ) 
}