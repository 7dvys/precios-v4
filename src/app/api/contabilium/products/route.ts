import { NextRequest } from "next/server";
import { getProducts } from "@/services/contabilium/getProducts";
import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys";
import { Product } from "@/types/Contabilium";
import { cookies } from "next/headers";

const {cbTokenMainKey,cbTokenSecondaryKey} = CONTABILIUM_KEYS

export const GET = async(request:NextRequest)=>{
    const cookiesStore = cookies()
    if(cookiesStore.has(cbTokenMainKey) && cookiesStore.has(cbTokenSecondaryKey)){
        const mainCbToken = cookiesStore.get(cbTokenMainKey)?.value as string;
        const secondaryCbToken = cookiesStore.get(cbTokenSecondaryKey)?.value as string;

        const mainProducts:Product[] = await getProducts({token:mainCbToken});
        const secondaryProducts:Product[] = await getProducts({token:secondaryCbToken})

        console.log(mainCbToken)
        return Response.json({mainProducts,secondaryProducts})
    }
    
    else
    return Response.json({});
}