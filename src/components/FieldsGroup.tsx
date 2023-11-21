import { Field, InputField, SelectField } from "@/types/FormFields"
import { Input } from "./Input"
import { Select } from "./Select"

interface FieldsGroupProps{
    fields:(InputField|SelectField)[]
}
export const FieldsGroup:React.FC<FieldsGroupProps> = ({fields})=>{
    return fields.map(field=>{
        return field.type != 'select'
        ?<Input key={`input-${field.name}`} {...field}/>
        :<Select key={`select-${field.name}`} {...field}/>
    })
}