import containerStyles from '@/styles/containers.module.css';
import { Tag } from '@/types/Listas';
import { Fragment  } from 'react';
import { TagComponent } from './Agregar/TagComponent';
import { LabelWrapper } from './LabelWrapper';
import { TagsEditorProps } from '@/types/TagsEditorTypes';

export const TagsEditor:React.FC<TagsEditorProps> = ({tags,addTag,removeTag,inferedTags})=>{

    const createTagHandler = ()=>{
        const tagId = prompt('nombre')
        if(tagId === null || tagId === '')
        return alert('el nombre no puede estar vacio');

        const descripcion = prompt('descripcion',tagId) || tagId;
        const fijo = Number(prompt('fijo','0'))
        if(isNaN(fijo))
        return alert('debes colocar un numero valido o 0.');
        

        const porcentual = Number(prompt('porcentual','0'))
        if(isNaN(porcentual))
        return alert('debes colocar un numero valido o 0.')
        
        const newTag:Tag = {descripcion,fijo,porcentual}
        addTag({tag:newTag,tagId})
    }
    
    return (
        <div className={`${containerStyles.container} flex-column flex-gap-xl`}>
            <LabelWrapper labelText='Tags'>
                <div className='flex-row flex-gap-l flex-wrap'>
                    {Object.entries(tags).map(([tagId,tag])=>
                        <Fragment key={tagId}>
                            <TagComponent {...tag} tagId={tagId} addTag={addTag} removeTag={removeTag}/>
                        </Fragment>
                    )}
                    <span onClick={createTagHandler}>+</span>
                </div>
            </LabelWrapper>

            {Object.keys(inferedTags).length > 0 &&
            <LabelWrapper labelText='Tags inferidas'>
                <div className='flex-row flex-gap-l flex-wrap'>
                    {Object.entries(inferedTags).map(([tagId,tag])=>
                        <Fragment key={tagId}>
                            <TagComponent {...tag} tagId={tagId} addTag={addTag} removeTag={removeTag}/>
                        </Fragment>
                    )}
                </div>
            </LabelWrapper>}
        </div>
    )
}