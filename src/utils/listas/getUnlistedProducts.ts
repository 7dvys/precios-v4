import { Products } from "@/types/Products";
import { observacionesHasLista } from "./observacionesHasLista";

export const getUnlistedProducts = ({products}:{products:Products})=>{
    const [main,secondary] = Object.values(products).map((accountProducts)=>{
        return accountProducts.filter(({Observaciones:observaciones})=>!observacionesHasLista(observaciones))
    })

    return {main,secondary} as Products;
}