import { LOCALHOST } from "@/constants/domain";
import { GetXlsxSheetFromSheetItemsInProductsParams } from "@/types/ListaUtilsTypes";
import { ListaItem } from "@/types/Listas";

export const getXlsxSheetFromMatchesBetweenProductsAndSheetWithApi = async (params:GetXlsxSheetFromSheetItemsInProductsParams):Promise<ListaItem[]|false> =>{
    const endpoint = LOCALHOST+'/api/xlsx/getXlsxSheetFromMatchesBetweenProductsAndSheet';
    const config:RequestInit = {
        method:'POST',
        body:JSON.stringify(params)
    }

    const listaItemsRequest = await fetch(endpoint,config);

    if(!listaItemsRequest.ok)
    return false;

    const listaItemsJSon = await listaItemsRequest.json();

    if(listaItemsJSon.error)
    return false;

    return listaItemsJSon
} 
