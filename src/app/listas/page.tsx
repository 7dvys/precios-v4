import { getProducts } from "@/utils/contabilium/getProducts"
import { getTokensFromCookies } from "@/utils/contabilium/getTokens"
import { Metadata } from "next"
import { ListasPage } from "../../components/Listas/ListasPage"
import { inferListas } from "@/utils/listas/inferListas"

export const metadata:Metadata = {
    title:'gautama - listas'
}
const Listas:React.FC = async ()=>{
    const tokens = getTokensFromCookies();
    const products =await getProducts(tokens);
    const inferedListas = inferListas({products});
    return <ListasPage inferedListas={inferedListas}/>
}

export default Listas;
