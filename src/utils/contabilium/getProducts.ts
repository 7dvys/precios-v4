import { getAccountProducts } from "@/services/contabilium/accountProducts";
import { Product } from "@/types/Contabilium";
import { Products } from "@/types/Products";

type GetProductsParameters = {
    cbTokenMain:string,
    cbTokenSecondary:string;
}

export const getProducts = async ({cbTokenMain,cbTokenSecondary}:GetProductsParameters):Promise<Products>=>{
    const mainProducts:Product[] = await getAccountProducts({token:cbTokenMain});
    const secondaryProducts:Product[] = await getAccountProducts({token:cbTokenSecondary})
    const products = {main:mainProducts,secondary:secondaryProducts}
    return products;
}
