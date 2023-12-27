import { AccountType } from "@/types/Config";
import { Product } from "@/types/Contabilium";
import { Products } from "@/types/Products";
import { useState } from "react";


export const useNewProducts = ()=>{
    const [newProducts,setNewProduct] = useState<Products>({main:[],secondary:[]});

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
    return {newProducts,createNewProduct}
}