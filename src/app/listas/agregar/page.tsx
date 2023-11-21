import { AgregarPage } from "@/components/Agregar/AgregarPage";
import { getProducts } from "@/utils/contabilium/getProducts";
import { getTokensFromCookies } from "@/utils/contabilium/getTokens";
import { getVendors } from "@/utils/contabilium/getVendors";
import { getCotizacionesUtilsDependencies } from "@/utils/cotizaciones/getCotizacionesUtilsDependencies";

const page = async ()=>{
    const tokens = getTokensFromCookies()
    const [vendors,products] = await Promise.all([getVendors(tokens),getProducts(tokens)])
    const cotizacionesUtilsDependencies = await getCotizacionesUtilsDependencies({products})
    return <AgregarPage cotizacionesUtilsDependencies={cotizacionesUtilsDependencies} vendors={vendors} products={products}/>
}
export default page;