import { ListaPage } from "@/components/Lista/ListaPage";
import { getProducts } from "@/utils/contabilium/getProducts";
import { getRubrosWithSubRubros } from "@/utils/contabilium/getRubrosWithSubRubros";
import { getTokensFromCookies } from "@/utils/contabilium/getTokens";
import { getVendors } from "@/utils/contabilium/getVendors";
import { getCotizacionesUtilsDependencies } from "@/utils/cotizaciones/getCotizacionesUtilsDependencies";
import { fixProducts } from "@/utils/listas/fixProducts";

const Page:React.FC<{params:{id:number}}> = async ({params})=>{
    const tokens = getTokensFromCookies();
    const [vendors,products] = await Promise.all([getVendors(tokens),getProducts(tokens)]);
    const rubrosWithSubRubrosPerAccount = await getRubrosWithSubRubros({tokens});     
    const fixedProducts = fixProducts({products,vendors});
    const cotizacionesUtilsDependencies = await getCotizacionesUtilsDependencies({products:fixedProducts});

    return <ListaPage tokens={tokens} listaId={params.id} cotizacionesUtilsDependencies={cotizacionesUtilsDependencies} products={fixedProducts} rubrosWithSubRubros={rubrosWithSubRubrosPerAccount}/>
}

export default Page;

