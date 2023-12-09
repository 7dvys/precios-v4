import { AccountType } from "@/types/Config";
import { Product } from "@/types/Contabilium";
import { Products } from "@/types/Products";
import { serializeProducts } from "@/utils/serializeProducts";
import { useMemo, useState } from "react";


export const useNewProducts = ({products}:{products:Products})=>{
    const [newProducts,setNewProduct] = useState<Products>({main:[],secondary:[]});

    const productsWithNewProducts:Products = {main:[...products.main,...newProducts.main],secondary:[...products.secondary,...newProducts.secondary]}

    const createNewProduct = ({product,account}:{product:Product,account:AccountType})=>{
        
        setNewProduct(currentNewProducts => {
            const productAlreadyExistOnNewProducts = currentNewProducts[account].some(({Codigo}) =>{
                return Codigo === product.Codigo
            })

            if(!productAlreadyExistOnNewProducts)
            return {...currentNewProducts,[account]:[...currentNewProducts[account],product]}

            return currentNewProducts;
        })
    }
    return {productsWithNewProducts,createNewProduct}
}