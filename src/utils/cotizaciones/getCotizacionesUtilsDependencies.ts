import { getProducts } from "../contabilium/getProducts";
import { getLatestCotizaciones } from "./getLatestCotizaciones";
import { getDolaresCotizaciones } from "./getDolaresCotizaciones";
import { Products } from "@/types";
import { CotizacionesUtilsDependencies } from "@/types/Cotizaciones";
import { getTokensFromCookies } from "../contabilium/getTokens";

export const getCotizacionesUtilsDependencies = async ({products:defaultProducts}:{products?:Products}):Promise<CotizacionesUtilsDependencies>=>{
    const products = defaultProducts ?? await getProducts(getTokensFromCookies());
    const latestCotizaciones = getLatestCotizaciones({products});
    const dolaresCotizaciones = await getDolaresCotizaciones();
    return ({latestCotizaciones,dolaresCotizaciones})
} 