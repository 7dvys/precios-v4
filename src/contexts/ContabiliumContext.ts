import { RubrosWithSubRubrosPerAccount, Tokens, Vendor } from "@/types/Contabilium"
import { Products } from "@/types/Products"
import { createContext } from "react"

type ContabiliumProviderProps = {
    tokens:Tokens
    fixedProducts:Products
    pullProducts:()=>void,
    updateProducts:({newProducts}:{newProducts:Products})=>void,
    vendors:Vendor[],
    pullVendors:()=>void,
    updateVendors:(newVendors:Vendor[])=>void,
    rubrosWithSubRubrosPerAccount:RubrosWithSubRubrosPerAccount,
}

export const ContabiliumContext = createContext<ContabiliumProviderProps>({
    rubrosWithSubRubrosPerAccount:{main:[],secondary:[]},
    tokens:{main:'',secondary:''},
    fixedProducts:{main:[],secondary:[]},
    pullProducts:()=>{},
    updateProducts:()=>{},
    vendors:[],
    pullVendors:()=>{},
    updateVendors:()=>{}
})