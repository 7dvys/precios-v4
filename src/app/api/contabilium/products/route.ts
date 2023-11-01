import { NextRequest } from "next/server";
import { getProducts } from "@/services/contabilium/products";
import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys";
import { Product } from "@/types/Contabilium";
import { Products } from "@/types";

const {cbTokenMainKey,cbTokenSecondaryKey} = CONTABILIUM_KEYS

export const GET = async(request:NextRequest)=>{
    const cookiesStore = request.cookies
    if(cookiesStore.has(cbTokenMainKey) && cookiesStore.has(cbTokenSecondaryKey)){
        
        const mainCbToken = cookiesStore.get(cbTokenMainKey)?.value as string;
        const mainProducts:Product[] = await getProducts({token:mainCbToken});
        
        const secondaryCbToken = cookiesStore.get(cbTokenSecondaryKey)?.value as string;
        const secondaryProducts:Product[] = await getProducts({token:secondaryCbToken})

        const products:Products = {main:mainProducts,secondary:secondaryProducts};
        return Response.json(products)
    }
    
    else
    return Response.json({});
}