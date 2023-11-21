import { RefObject } from "react"

export type Option = {value:string|number,title?:string}
export type FieldType = 'password'|'number'|'positiveNumber'|'string'|'select'

export type Field = {
    name:string,
    placeholder?:string,
    optionList:Option[],
    type:FieldType,
    disabled?:boolean,
}

export type InputField = Field & {
    type:Exclude<FieldType,'select'>;
    fieldRef?:RefObject<HTMLInputElement>
} 

export type SelectField = Field & {
    type:'select';
    fieldRef?:RefObject<HTMLSelectElement>
} 

export type FieldsGroupType = {
    label?:string,
    fields:Field[],
}

export type FieldsGroupList = FieldsGroupType[]

