import { Tags } from "@/types/Listas";
import { getTagsCoeficients } from "./getTagsCoeficients";

export const genFinalCostPriceAndFinalPrice = ({tags,tagsId,costo,rentabilidad,iva}:{costo:number,rentabilidad:number,iva:number,tags:Tags,tagsId:string[]})=>{
    const {fixedCoeficient,porcentualCoeficientFactor} = getTagsCoeficients({tags,itemTagsId:tagsId})

    const finalCost = (costo*porcentualCoeficientFactor)+fixedCoeficient;
    const price = finalCost*((rentabilidad/100)+1);
    const finalPrice = price*((iva/100)+1);

    const porcentualCoeficient = (porcentualCoeficientFactor-1)*100;

    return {finalCost,price,finalPrice,fixedCoeficient,porcentualCoeficient}
}