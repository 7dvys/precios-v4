import { Products } from "@/types"
import { Cotizaciones } from "@/types/Cotizaciones"
import { simpleDataSerializer } from "../simpleDataSerializer";
import { Observaciones, ObservacionesWithoutTags } from "@/types/Contabilium";
import { isDate } from "../isDate";
import { localeDateStringToDate } from "../localeDateStringToDate";

const {decoder} = simpleDataSerializer();

export const getLatestCotizaciones = ({products}:{products:Products}):Cotizaciones=>{
    const historicalCotizacionesList:Record<string,{ultActualizacion:Date,cotizacionPrecio:number}[]> = {};

    Object.values(products).forEach(accountProducts=>{
        accountProducts.forEach(({Observaciones},index)=>{
            if(!Observaciones)
            return;

            const decodedObservaciones = decoder<ObservacionesWithoutTags>(Observaciones as string) ;

            

            if(!('ultActualizacion' in decodedObservaciones) || !('cotizacion' in decodedObservaciones) || !('cotizacionPrecio' in decodedObservaciones))
            return;

            const {ultActualizacion:[ultActualizacion],cotizacion:[cotizacion],cotizacionPrecio:[cotizacionPrecio],} = decodedObservaciones;
            if(cotizacion === 'peso')
            return;

            const date = isDate(new Date(ultActualizacion))?new Date(ultActualizacion):localeDateStringToDate(ultActualizacion);

            if(!date)
            return;        
                        
            if(!(cotizacion in historicalCotizacionesList))
            historicalCotizacionesList[cotizacion] = [{ultActualizacion:date,cotizacionPrecio}];

            else
            historicalCotizacionesList[cotizacion].push({ultActualizacion:date,cotizacionPrecio});
        })
    })

    const latestCotizaciones:Cotizaciones = Object.entries(historicalCotizacionesList).reduce((acc,[cotizacion,historicos])=>{
        const latestCotizacionPrecio = historicos.sort(({ultActualizacion:dateA},{ultActualizacion:dateB})=>{
            return dateA==dateB?0:dateA>dateB?1:-1;
        }).reverse()[0].cotizacionPrecio;

        acc[cotizacion]=latestCotizacionPrecio;
        return acc;
    },{} as Cotizaciones);

    return latestCotizaciones;
}