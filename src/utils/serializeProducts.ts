import { Product } from "@/types/Contabilium";
import { Products } from "@/types/Products";

export const serializeProducts = ({products}:{products:Products})=>{
    const [mainSerializedProducts,secondarySerializedProducts] = Object.values(products).map(accountProducts=>{
        return accountProducts.reduce((acc,product)=>{
            const sku = product.Codigo;
            acc[sku] = product
            return acc;
        },{} as Record<string,Product>)
    })

    return {main:mainSerializedProducts,secondary:secondarySerializedProducts};
}