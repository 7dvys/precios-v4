import { getAccountProducts } from "@/services/contabilium/accountProducts";
import { Product, Tokens } from "@/types/Contabilium";
import { Products } from "@/types/Products";

export const getProducts = async ({tokens}:{tokens:Tokens}):Promise<Products> =>{

    const mainProducts:Product[] = await getAccountProducts({token:tokens.main});
    const secondaryProducts:Product[] = await getAccountProducts({token:tokens.secondary})
    
    const products = {main:mainProducts,secondary:secondaryProducts}
    return products;
}
