import { tagComponentStyles } from "@/styles/TagComponentStyles";
import { PenIcon } from "../icons/Pen"
import { TagComponentProps } from "@/types/TagComponentTypes"

export const TagComponent:React.FC<TagComponentProps> = ({tagId,descripcion,porcentual,fijo,addTag,removeTag})=>{
    const editTaghandler = (tagId:string)=>{
        const descripcion = prompt('descripcion') || '';

        const fijo = Number(prompt('fijo','0'))
        if(isNaN(fijo)){
            alert('debes colocar un numero valido o 0.')
            return;
        }

        const porcentual = Number(prompt('porcentual','0'))
        if(isNaN(porcentual)){
            alert('debes colocar un numero valido o 0.')
            return;
        } 

        const newTag = {descripcion,fijo,porcentual}
        addTag({tagId,tag:newTag});
    }
    
    const removeTagHandler = (tagId:string)=>{
        const removeConfirmation = confirm('eliminar '+tagId);
        if(removeConfirmation)
        removeTag({tagId})
    }

    return (
        <div title={descripcion} style={tagComponentStyles} className="flex-row flex-gap-l">
            <p><strong>id: </strong>{tagId}</p>
            <p><strong>fijo: </strong>{fijo>0?'+'+fijo:'-'+fijo}</p>
            <p><strong>porcentual: </strong>{porcentual>0?'+'+porcentual:'-'+porcentual}%</p>
            <div onClick={()=>editTaghandler(tagId)}>{PenIcon}</div>
            <div onClick={()=>removeTagHandler(tagId)}>X</div>
        </div>
    )

}