import { getCotizacionesUtilsDependencies } from "@/utils/cotizaciones/getCotizacionesUtilsDependencies";
import { CotizacionesPage } from "./cotizacionesPage";

export default async ()=>{
    const cotizacionesUtilsDependencies = await getCotizacionesUtilsDependencies({});
    return <CotizacionesPage cotizacionesUtilsDependencies={cotizacionesUtilsDependencies}/>
};