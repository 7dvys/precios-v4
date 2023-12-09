import { AgregarPage } from "@/components/Agregar/AgregarPage";
import { getAccountRubrosWithSubRubros } from "@/services/contabilium/accountRubrosWithSubRubros";
import { getProducts } from "@/utils/contabilium/getProducts";
import { getRubrosWithSubRubros } from "@/utils/contabilium/getRubrosWithSubRubros";
import { getTokensFromCookies } from "@/utils/contabilium/getTokens";
import { getVendors } from "@/utils/contabilium/getVendors";
import { getCotizacionesUtilsDependencies } from "@/utils/cotizaciones/getCotizacionesUtilsDependencies";
import { fixProducts } from "@/utils/listas/fixProducts";

const page = async ()=>{
    const tokens = getTokensFromCookies();
    const [vendors,products] = await Promise.all([getVendors(tokens),getProducts(tokens)]);
    const rubrosWithSubRubrosPerAccount = await getRubrosWithSubRubros({tokens});     
    const fixedProducts = fixProducts({products,vendors});
    const cotizacionesUtilsDependencies = await getCotizacionesUtilsDependencies({products:fixedProducts});
    return <AgregarPage tokens={tokens} rubrosWithSubRubros={rubrosWithSubRubrosPerAccount} cotizacionesUtilsDependencies={cotizacionesUtilsDependencies} vendors={vendors} products={fixedProducts}/>
}
export default page;