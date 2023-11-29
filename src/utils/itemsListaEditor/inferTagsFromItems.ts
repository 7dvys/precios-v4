import { ListaItem, Tags } from "@/types/Listas";

export const inferTagsFromsItems = ({items,tags}:{items:ListaItem[],tags:Tags})=>{
    return items.reduce((inferedTags,item)=>{
        item.tagsId.forEach(tagId=>{
            if(!(tagId in inferedTags) && !(tagId in tags))
            inferedTags[tagId] = {fijo:0,porcentual:0,descripcion:'tag inferida: '+tagId};
        })
        return inferedTags;
    },{} as Tags)
}