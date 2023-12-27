import { Tags } from "@/types/Listas";

export const getTagsCoeficients = ({tags,itemTagsId}:{tags:Tags,itemTagsId:string[]})=>{
    let fixedCoeficient = 0;
    let porcentualCoeficientFactor = 1;

    if(!Object.keys(tags).length || !itemTagsId.length)
    return {fixedCoeficient,porcentualCoeficientFactor};
    
    itemTagsId.forEach(tagId=>{
        if(tagId in tags){
            const {fijo,porcentual} = tags[tagId];
            const porcentualFactor = (porcentual/100)+1;
            fixedCoeficient+=fijo;
            porcentualCoeficientFactor*=porcentualFactor;
        }
    })
    return {fixedCoeficient,porcentualCoeficientFactor};
}