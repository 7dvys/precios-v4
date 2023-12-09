import { updateAccountProducts } from "@/services/contabilium/accountProducts";
import { Products } from "@/types/Products";
import { Tokens } from "@/types/Contabilium";
// import { revalidateTag } from "next/cache";
// import { cookies } from "next/headers";
// import { inspect } from "util";


export const updateProducts = async ({cbTokenMain,cbTokenSecondary}:Tokens,{main,secondary}:Products)=>{
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
