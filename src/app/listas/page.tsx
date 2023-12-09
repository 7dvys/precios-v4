import { getProducts } from "@/utils/contabilium/getProducts"
import { getTokensFromCookies } from "@/utils/contabilium/getTokens"
import { Metadata } from "next"
import { ListasPage } from "../../components/Listas/ListasPage"
import { inferListas } from "@/utils/listas/inferListas"
import { fixProducts } from "@/utils/listas/fixProducts"
import { getVendors } from "@/utils/contabilium/getVendors"

export const metadata:Metadata = {
    title:'gautama - listas'
}
const Listas:React.FC = async ()=>{
    const tokens = getTokensFromCookies();
    const [vendors,products] = await Promise.all([getVendors(tokens),getProducts(tokens)])
    const fixedProducts = fixProducts({products,vendors})
    const inferedListas = inferListas({products:fixedProducts});

    return <ListasPage inferedListas={inferedListas}/>
}

export default Listas;
