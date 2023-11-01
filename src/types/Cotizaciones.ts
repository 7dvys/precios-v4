import { cotizacionesUtils } from "@/utils/cotizaciones/cotizacionesUtils"

export type Cotizaciones = Record<string,number>

export type DolaresCotizaciones = {
    blue:number,
    oficial:number
}

export type CotizacionesUtilsDependencies = {
    latestCotizaciones:Cotizaciones,
    dolaresCotizaciones:DolaresCotizaciones
}

export type CotizacionesUtils = ReturnType<typeof cotizacionesUtils>;