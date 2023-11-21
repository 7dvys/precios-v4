import containerStyles from '@/styles/containers.module.css';
import { Tag } from '@/types/Listas';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { TagComponent } from './TagComponent';
import { LabelWrapper } from '../LabelWrapper';

export type TagsPanelProps = {
    tags:Tag[]
    setTags:Dispatch<SetStateAction<Tag[]>>
    inferedTags:Tag[]
}

export const TagsPanel:React.FC<TagsPanelProps> = ({tags,setTags,inferedTags})=>{
    return (
        <div className={`${containerStyles.container} flex-column flex-gap-xl`}>
            <LabelWrapper labelText='Tags'>
                <div className='flex-row flex-gap-l flex-wrap'>
                    {tags.map((tag,index)=><Fragment key={index}><TagComponent {...tag} setTags={setTags}/></Fragment>)}
                </div>
            </LabelWrapper>
        </div>
    )
}