import { DefaultSheetValues, FormatedJsonSheet, FormatedJsonSheetItem, SerializedFormatedJsonSheet, XlsxSheet } from "@/types/AgregarTypes";
import { sheetToJson } from "../xlsx/sheetToJson";
import { formatJsonSheet } from "./formatJsonSheet";
import { ListaItem, SerializedItemsFromLista } from "@/types/Listas";
import { GetXlsxSheetFromSheetItemsInProductsParams } from "@/types/ListaUtilsTypes";
import { UnifiedProducts } from "@/types/Products";
import { decodeObservaciones } from "../decodeObservaciones";

const serializeFormatedJsonSheet = ({overWrite,xlsxSheets,formatedJsonSheet}:{overWrite:boolean,xlsxSheets:XlsxSheet[],formatedJsonSheet:FormatedJsonSheet}):SerializedFormatedJsonSheet=>{
    const xlsxSheetsItemsCodigos = (overWrite === false && xlsxSheets.flatMap(({items})=>items.map(({codigo})=>codigo))) || []
    
    const serializedFormatedJsonSheet = formatedJsonSheet.reduce((acc,item)=>{
        const isInXlsxSheetsItemsCodigos = xlsxSheetsItemsCodigos.length > 0 && xlsxSheetsItemsCodigos.some(codigo=>codigo === item.codigo);
        if(!isInXlsxSheetsItemsCodigos)
        acc[item.codigo]=item;
        return acc;
    },{} as Record<string,FormatedJsonSheetItem>)

    return serializedFormatedJsonSheet;
}

const getMatchesBetweenProductsAndSheet = ({unifiedProducts,serializedFormatedJsonSheet,defaultExchRate,defaultIva,defaultProfit}:{unifiedProducts:UnifiedProducts,serializedFormatedJsonSheet:SerializedFormatedJsonSheet} & DefaultSheetValues):SerializedItemsFromLista=>{
    return unifiedProducts.reduce((acc,{account,...product})=>{
        const codigo = product.Descripcion;
        const sku = product.Codigo

        if(!(codigo in serializedFormatedJsonSheet))
        return acc;

        const sheetItem = serializedFormatedJsonSheet[codigo];

        const inferCotizacion = ()=>{
            if(!product.Observaciones)
            return null;

            const decodedObservaciones = decodeObservaciones(product.Observaciones);
            const inferedCotizacion = decodedObservaciones !== null && decodedObservaciones.cotizacion[0] || null
            return inferedCotizacion
        }
        
        if(!(codigo in acc)){
            const cbItemSkus:Record<'main'|'secondary',string[]> = {main:[],secondary:[]};
            cbItemSkus[account as 'main'|'secondary'].push(sku); 

            acc[codigo] = {
                ...sheetItem,
                cbItemSkus,
                iva:sheetItem.iva || product.Iva || defaultIva, 
                rentabilidad:sheetItem.rentabilidad || product.Rentabilidad || defaultProfit,
                cotizacion:sheetItem.cotizacion || inferCotizacion() || defaultExchRate
            }
        }
        else{
            acc[codigo].cbItemSkus[account as 'main'|'secondary'].push(sku); 
            acc[codigo].iva = product.Iva || defaultIva;
            acc[codigo].rentabilidad = product.Rentabilidad || defaultProfit;
            acc[codigo].cotizacion = inferCotizacion() || defaultExchRate;
        }

        return acc;

    },{} as Record<string,ListaItem>)
}

const appendMissingItemsToMatchesBetweenProductsAndSheet = ({serializedFormatedJsonSheet,matchesBetweenProductsAndSheet,defaultExchRate,defaultIva,defaultProfit}:{serializedFormatedJsonSheet:SerializedFormatedJsonSheet,matchesBetweenProductsAndSheet:SerializedItemsFromLista} & DefaultSheetValues)=>{
    return Object.keys(serializedFormatedJsonSheet).reduce((acc,codigo)=>{
        if(codigo in acc)
        return acc;

        const sheetItem = serializedFormatedJsonSheet[codigo];
        const cbItemSkus:Record<'main'|'secondary',string[]> = {main:[],secondary:[]};

        acc[codigo] = {
            ...sheetItem,
            cbItemSkus,
            iva:sheetItem.iva || defaultIva, 
            rentabilidad:sheetItem.rentabilidad || defaultProfit,
            cotizacion:sheetItem.cotizacion || defaultExchRate
        }

        return acc;
    },matchesBetweenProductsAndSheet)
}

export const getXlsxSheetFromMatchesBetweenProductsAndSheet = ({products,xlsxWorkbook,overWrite,xlsxSheets,sheetName,defaultExchRate,defaultIva,defaultProfit,...sheetCols}:GetXlsxSheetFromSheetItemsInProductsParams):ListaItem[]=>{
    const unifiedProducts:UnifiedProducts = Object.values(products).flatMap((accountProducts,index)=>accountProducts.map(product=>({...product,account:index?'secondary':'main'})))
    const jsonSheet = sheetToJson({xlsxWorkbook,sheetName});
    const formatedJsonSheet = formatJsonSheet({jsonSheet,...sheetCols});   
    const serializedFormatedJsonSheet = serializeFormatedJsonSheet({formatedJsonSheet,overWrite,xlsxSheets})
    const matchesBetweenProductsAndSheet = getMatchesBetweenProductsAndSheet({unifiedProducts,serializedFormatedJsonSheet,defaultExchRate,defaultIva,defaultProfit})
    const allSheetItems = appendMissingItemsToMatchesBetweenProductsAndSheet({matchesBetweenProductsAndSheet,serializedFormatedJsonSheet,defaultExchRate,defaultIva,defaultProfit})
    
    return Object.values(allSheetItems)
}