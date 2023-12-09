import { LOCALHOST } from "@/constants/domain";
import { Vendor } from "@/types/Contabilium";
import { Products } from "@/types/Products";

export const fixProductWithApi = async ({products,vendors}:{products:Products,vendors:Vendor[]})=>{
    const endpoint = LOCALHOST+'/api/productsUtils/fixProducts';
    const config:RequestInit = {
        method:'POST',
        body:JSON.stringify({products,vendors})
    }

    const fixedProducts = await fetch(endpoint,config);

    if(!fixedProducts.ok)
    return false;

    const fixedProductsJson:Products = await fixedProducts.json();

    return fixedProductsJson
}