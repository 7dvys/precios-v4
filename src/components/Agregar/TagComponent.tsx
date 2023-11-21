import { Tag } from "@/types/Listas"
import { CSSProperties, Dispatch, Fragment, SetStateAction, useState } from "react"
import { PenIcon } from "../icons/Pen"
import { LabelWrapper } from "../LabelWrapper"

type TagComponentProps = Tag & {
    setTags:Dispatch<SetStateAction<Tag[]>>
}

const tagStyles:CSSProperties = {
    padding:'0.5rem',
    flexGrow:0,
    flexShrink:0,
    border:'1px solid var(--grey-beige-0)',
    borderRadius:2,
}

export const TagComponent:React.FC<TagComponentProps> = ({id,descripcion,porcentual,fijo,setTags})=>{
    
    const editPromps = ()=>{
        alert('estas editando')
    }
    
    return (
        <div title={descripcion} style={tagStyles} className="flex-row flex-gap-l">
            <p><strong>id: </strong>{id}</p>
            <p><strong>fijo: </strong>{fijo>0?'+'+fijo:'-'+fijo}</p>
            <p><strong>porcentual: </strong>{porcentual>0?'+'+porcentual:'-'+porcentual}%</p>
            <div onClick={editPromps}>{PenIcon}</div>
        </div>
    )

}