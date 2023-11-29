import { getAccountProducts } from "@/services/contabilium/accountProducts";
import { Products } from "@/types";
import { Product } from "@/types/Contabilium";

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
