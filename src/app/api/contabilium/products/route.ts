import { NextRequest } from "next/server";
import { getAccountProducts, updateAccountProducts } from "@/services/contabilium/accountProducts";
import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys";
import { Product } from "@/types/Contabilium";
import { Products } from "@/types/Products";


const {cbTokenMainKey,cbTokenSecondaryKey} = CONTABILIUM_KEYS

export const GET = async(request:NextRequest)=>{
    const cookiesStore = request.cookies
    if(cookiesStore.has(cbTokenMainKey) && cookiesStore.has(cbTokenSecondaryKey)){
        
        const mainCbToken = cookiesStore.get(cbTokenMainKey)?.value as string;
        const mainProducts:Product[] = await getAccountProducts({token:mainCbToken});

        const secondaryCbToken = cookiesStore.get(cbTokenSecondaryKey)?.value as string;
        const secondaryProducts:Product[] = await getAccountProducts({token:secondaryCbToken})

        const products:Products = {main:mainProducts,secondary:secondaryProducts};
        return Response.json(products)
    }
    
    else
    return Response.json({});
}

export const PUT = async (request:NextRequest)=>{
    const cookiesStore = request.cookies
    if(cookiesStore.has(cbTokenMainKey) && cookiesStore.has(cbTokenSecondaryKey)){
        const {main,secondary}:Products = await request.json()
        const mainCbToken = cookiesStore.get(cbTokenMainKey)?.value as string;
        const mainUpdatesStatus = await updateAccountProducts({products:main,token:mainCbToken});
        const secondaryCbToken = cookiesStore.get(cbTokenSecondaryKey)?.value as string;
        const secondaryUpdatesStatus = await updateAccountProducts({products:secondary,token:secondaryCbToken});

        return Response.json({main:mainUpdatesStatus,secondary:secondaryUpdatesStatus});
    }
    return Response.json({});
    
}