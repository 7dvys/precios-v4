import { NextRequest } from "next/server";
import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys";
import { Vendor } from "@/types/Contabilium";
import { getAccountVendors } from "@/services/contabilium/accountVendors";

const {cbTokenMainKey} = CONTABILIUM_KEYS

export const GET = async(request:NextRequest)=>{
    const cookiesStore = request.cookies
    if(cookiesStore.has(cbTokenMainKey)){
        
        const mainCbToken = cookiesStore.get(cbTokenMainKey)?.value as string;
        const mainVendors:Vendor[] = await getAccountVendors({token:mainCbToken});

        return Response.json(mainVendors)
    }
    
    else
    return Response.json({});
}