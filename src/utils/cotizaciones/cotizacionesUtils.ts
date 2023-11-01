import { isClient } from "@/constants/isClient";
import { LOCALSTORAGE_KEYS } from "@/constants/localStorage"
import { Cotizaciones, CotizacionesUtilsDependencies } from "@/types/Cotizaciones";

export const cotizacionesUtils = ({latestCotizaciones,dolaresCotizaciones}:CotizacionesUtilsDependencies)=>{

    const getCotizaciones = (): Cotizaciones => {
        const cotizacionesJson = isClient?localStorage.getItem(LOCALSTORAGE_KEYS.cotizaciones)??'{}':'{}';
        return JSON.parse(cotizacionesJson);
    }

    const updateCotizacion = ({title,value}:{title:string,value:number})=>{
        const cotizacion = getCotizaciones()
        if(value>0){
            cotizacion[title] = value;
            isClient && localStorage.setItem(LOCALSTORAGE_KEYS.cotizaciones,JSON.stringify(cotizacion))
        }
        return getCotizaciones();
    }

    const removeCotizacion = ({title}:{title:string})=>{
        const cotizaciones = getCotizaciones()
        const newCotizaciones = Object.entries(cotizaciones).reduce((acc,[key,value])=>{
            if(key != title)
            acc[key] = value
            return acc
        },{} as Record<string,number>)
        isClient && localStorage.setItem(LOCALSTORAGE_KEYS.cotizaciones,JSON.stringify(newCotizaciones))
        return getCotizaciones();
    }

    const initCotizaciones = ()=>{
        const currentCotizaciones = getCotizaciones();
        const {blue,oficial} = dolaresCotizaciones;
        const defaultCotizaciones = {peso:1,blue,oficial}

        const initialAndLatestCotizations = {...defaultCotizaciones,...latestCotizaciones}
        Object.entries(initialAndLatestCotizations).forEach(([title,value])=>{
            if(title in defaultCotizaciones || !(title in currentCotizaciones))
            updateCotizacion({title,value});
        });
    }

    initCotizaciones();

    return {getCotizaciones,updateCotizacion,removeCotizacion}
}
