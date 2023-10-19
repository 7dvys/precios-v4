'use client'
import containerStyles from '@/styles/containers.module.css'
import { FieldsGroup } from "@/components/FieldsGroup";
import { FieldsGroupType, FieldsGroupList } from '@/types/FormFields';
import { Fragment, RefObject, useRef } from 'react';

interface EntryFieldsProps{
    fieldsGroupList:FieldsGroupList;
    children?:React.ReactNode;
    childrenIndex?:number;
}

type RenderFieldGroupProps = EntryFieldsProps & FieldsGroupType &{
    groupIndex:number
}

const renderFieldGroup = ({label,fields,groupIndex,children,childrenIndex,fieldsGroupList}:RenderFieldGroupProps)=>{
    const renderFieldGroup = (
        <Fragment key={`${groupIndex}`}>
        <label>{label}</label>
        {fields.length>1?<div><FieldsGroup fields={fields}/></div>:<FieldsGroup fields={fields}/>}
        </Fragment>
    )

    if((!childrenIndex  && groupIndex == 0)|| childrenIndex == groupIndex)
    return [children,renderFieldGroup]

    if(childrenIndex && childrenIndex>=fieldsGroupList.length && groupIndex == fieldsGroupList.length-1)
    return [renderFieldGroup,children]

    return renderFieldGroup
}

const EntryFields:React.FC<EntryFieldsProps> = (entryFieldsProps)=>{
    // first adapt fieldsGroupList with refs and set new refs list.
    return entryFieldsProps.fieldsGroupList.map((fieldsGroup,groupIndex)=>{
        return renderFieldGroup({...fieldsGroup,...entryFieldsProps,groupIndex})
    })
}

const getFieldsGroupListWithRefs = (fieldsGroupList:FieldsGroupList)=>{
    const fieldGroupRefs:Record<string,RefObject<HTMLSelectElement|HTMLInputElement>> = {}
    
    const fieldsGroupListWithRefs = fieldsGroupList.map(fieldGroup=>{
        const {label,fields} = fieldGroup;
        const fieldsWithRefs = fields.map(field=>{
            const {name,type} = field;
            const fieldRef = type=='select'?useRef<HTMLSelectElement>(null):useRef<HTMLInputElement>(null)
            const refName = `${label}${name}`
            fieldGroupRefs[refName] = fieldRef
            return {...field,fieldRef}
        })
        return {label,fields:fieldsWithRefs}
    })

    return {fieldGroupRefs,fieldsGroupListWithRefs}
}

interface CustomParameterManagerProps{
    title:string;
    fieldsGroupList:FieldsGroupList;
}

export const useCustomParameterManager = ({title,fieldsGroupList}:CustomParameterManagerProps)=>{
    
    const {fieldGroupRefs,fieldsGroupListWithRefs} = getFieldsGroupListWithRefs(fieldsGroupList)

    const ParameterManager:React.FC<{children?:React.ReactNode,childrenIndex?:number,submitFunction:()=>void}> = ({children,childrenIndex,submitFunction})=>{
        return (
            <div className={`${containerStyles['container--form']} ${containerStyles.container}`}>
                <h3>{title}</h3>
                <EntryFields fieldsGroupList={fieldsGroupListWithRefs} childrenIndex={childrenIndex}>{children}</EntryFields>
                <div>
                    <button onClick={submitFunction}>aceptar</button>
                </div>
            </div>
        )
    }

    return {ParameterManager,fieldGroupRefs};
}