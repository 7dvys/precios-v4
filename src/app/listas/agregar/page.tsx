import { AgregarPage } from "@/components/Agregar/AgregarPage";
import { getProducts } from "@/utils/contabilium/getProducts";
import { getTokensFromCookies } from "@/utils/contabilium/getTokens";
import { getVendors } from "@/utils/contabilium/getVendors";
import { getCotizacionesUtilsDependencies } from "@/utils/cotizaciones/getCotizacionesUtilsDependencies";
import { fixProduct } from "@/utils/listas/fixProducts";

const page = async ()=>{
    const tokens = getTokensFromCookies()
    const [vendors,products] = await Promise.all([getVendors(tokens),getProducts(tokens)])
    const fixedProducts = fixProduct(products,vendors)
    const cotizacionesUtilsDependencies = await getCotizacionesUtilsDependencies({products:fixedProducts})
    return <AgregarPage cotizacionesUtilsDependencies={cotizacionesUtilsDependencies} vendors={vendors} products={fixedProducts}/>
}
export default page;