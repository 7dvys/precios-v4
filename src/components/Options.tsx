import { Option } from "@/types/FormFields";

interface OptionsProps{
    optionList:Option[],
}
export const Options:React.FC<OptionsProps> = ({optionList})=>{
    if(!optionList.length) return null;
    return optionList.map(({value,title},index)=>(
        <option key={index} value={value}>{title?title:value}</option>
    ))
}