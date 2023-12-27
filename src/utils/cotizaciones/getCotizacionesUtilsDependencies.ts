import { getLatestCotizaciones } from "./getLatestCotizaciones";
import { getDolaresCotizaciones } from "./getDolaresCotizaciones";
import { Products } from "@/types/Products";
import { CotizacionesUtilsDependencies } from "@/types/Cotizaciones";

export const getCotizacionesUtilsDependencies = async ({products}:{products:Products}):Promise<CotizacionesUtilsDependencies>=>{
    const latestCotizaciones = getLatestCotizaciones({products});
    const dolaresCotizaciones = await getDolaresCotizaciones();
    return ({latestCotizaciones,dolaresCotizaciones})
} 