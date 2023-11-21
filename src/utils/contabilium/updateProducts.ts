import { updateAccountProducts } from "@/services/contabilium/accountProducts";
import { Products } from "@/types";
// import { revalidateTag } from "next/cache";
// import { cookies } from "next/headers";
// import { inspect } from "util";

type cbTokens = {
    cbTokenMain:string,
    cbTokenSecondary:string
}

export const updateProducts = async ({cbTokenMain,cbTokenSecondary}:cbTokens,{main,secondary}:Products)=>{
    const mainUpdatesStatus = await updateAccountProducts({products:main,token:cbTokenMain});
    const secondaryUpdatesStatus = await updateAccountProducts({products:secondary,token:cbTokenSecondary});
    return {main:mainUpdatesStatus,secondary:secondaryUpdatesStatus};
}

// export const updateProducts = async (products:Products)=>{
//     const baseUrl = 'http://localhost:3000';

//     const config:RequestInit = {
//         method:'PUT',
//         credentials:'include',
//         headers:{
//             Cookie:cookies().toString()
//         },
//         body:JSON.stringify(products),
//         cache:'no-store',
//     }
//     const productsResponse = await fetch(baseUrl+'/api/contabilium/products',config)
    
//     revalidateTag('accountProducts')

//     if(!productsResponse.ok)
//     return {main:[],secondary:[]}
    
    
//     return await productsResponse.json();
// }
