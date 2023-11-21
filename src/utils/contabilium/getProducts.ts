import { getAccountProducts } from "@/services/contabilium/accountProducts";
import { Products } from "@/types";
import { Product } from "@/types/Contabilium";
// import { cookies } from "next/headers";

// export const getProducts = async ()=>{
//     let products:Products = {main:[],secondary:[]};
    
//     const baseUrl = 'http://127.0.0.1:3000';
//     const config:RequestInit = {
//         method:'GET',
//         credentials:'include',
//         headers:{
//             Cookie:cookies().toString() 
//         },
//         // cache:'no-store'
//     }
//     const productsResponse = await fetch(baseUrl+'/api/contabilium/products',config);

//     if(productsResponse.ok)
//     products = await productsResponse.json();

//     return products;
// }   
type GetProductsParameters = {
    cbTokenMain:string,
    cbTokenSecondary:string;
}

export const getProducts = async ({cbTokenMain,cbTokenSecondary}:GetProductsParameters):Promise<Products>=>{
    const mainProducts:Product[] = await getAccountProducts({token:cbTokenMain});
    const secondaryProducts:Product[] = await getAccountProducts({token:cbTokenSecondary})
    return {main:mainProducts,secondary:secondaryProducts}
}
