import { Option } from "@/types/FormFields";

interface OptionsProps{
    optionList:Option[],
    placeholder?:string;
}
export const Options:React.FC<OptionsProps> = ({optionList,placeholder})=>{
    if(!optionList.length) 
    return null;

    return (
        <>
        {placeholder && <option value="none">{placeholder}</option>}
        {optionList.map(({value,title},index)=>(
        <option key={index} value={value}>{title?title:value}</option>
        ))}
        </>
    )
    

}