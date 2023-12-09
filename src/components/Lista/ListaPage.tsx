'use client'
import { isClient } from "@/constants/isClient";
import { ListaPageProps } from "@/types/ListaPageTypes";
import { cotizacionesUtils } from "@/utils/cotizaciones/cotizacionesUtils";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";
import { Lista } from "./Lista";

export const ListaPage:React.FC<ListaPageProps> =  async ({listaId,cotizacionesUtilsDependencies,tokens,rubrosWithSubRubros,products})=>{
    if(!isClient)
    return;

    const {getCotizaciones} = cotizacionesUtils(cotizacionesUtilsDependencies);
    const cotizaciones = getCotizaciones();

    const {getListas} = await dbListasUtils()
    const listas = await getListas();
    const lista = listas[Number(listaId)]

    return (
        <>
            <Lista lista={lista} tokens={tokens} rubrosWithSubRubros={rubrosWithSubRubros}  cotizaciones={cotizaciones} products={products}/>
        </>
    )

}