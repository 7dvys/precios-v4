import { defaultProduct } from "@/constants/contabilium/defaultProduct"


export const populateDefaultProduct = (values:Record<string,string|number|null>)=>{
    return {...defaultProduct,...values};
}