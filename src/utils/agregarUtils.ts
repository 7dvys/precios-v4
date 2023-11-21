import { DefaultSheetValues, FormatedJsonSheet, FormatedJsonSheetItem, JsonSheet, SheetCols, SheetToJsonParams, XlsxListaItems } from '@/types/AgregarTypes';
import * as XLSX from 'xlsx';
import { letterToNumber } from './letterToNumber';
import { Products } from '@/types';
import { ListaItem } from '@/types/Listas';
import { simpleDataSerializer } from './simpleDataSerializer';
import { decodeObservaciones } from './decodeObservaciones';
import { LOCALHOST } from '@/constants/domain';

export type GetListaItemsFromSheetItemsInProductsParams = {
    products:Products,
    overWrite:boolean,
    xlsxListaItemsList:XlsxListaItems[]
} & SheetCols & SheetToJsonParams & DefaultSheetValues;

export const getXlsxWorkBookFromFile = async (file:File)=>{
    if(!file)
    return ({error:'empty file'});

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    return workbook;
}

export const getXlsxWorkBookFromFileWithApi = async (file:File):Promise<(XLSX.WorkBook|false)> =>{
    if(!file)
    return false;

    const data = new FormData();
    data.append('file',file);

    const endpoint = LOCALHOST+'/api/xlsx/getXlsxWorkBookFromFile';
    const config:RequestInit = {
        method:'POST',
        body:data
    }

    const xlsxWorkbookRequest = await fetch(endpoint,config);

    if(!xlsxWorkbookRequest.ok)
    return false;

    const xlsxWorkbookJson = await xlsxWorkbookRequest.json();

    if(xlsxWorkbookJson.error)
    return false;

    return xlsxWorkbookJson
}

export const sheetToJson = ({xlsxWorkbook,sheetName}:SheetToJsonParams):JsonSheet => {
    const xlsxWorkbookSheet = xlsxWorkbook.Sheets[sheetName];
    const sheetToJson=XLSX.utils.sheet_to_json(xlsxWorkbookSheet,{header:1,defval:'_null'}) as JsonSheet;
    return sheetToJson;
}

export const formatJsonSheet = ({jsonSheet,colCod,colTitle,colCost,colIva,colProfit,colTags,colExchRate}:{jsonSheet:JsonSheet} & SheetCols):FormatedJsonSheet=>{
    const formatCol = (col:string|number)=>(typeof col === 'number'?col:letterToNumber(col));
    const formatOptionalCol = (col:string|number|null)=>(col !== null && formatCol(col)-1 || null)
    const formatedColCod = formatCol(colCod)-1;
    const formatedColCost = formatCol(colCost)-1;
    const [formatedColTitle,formatedColIva,formatedColProfit,formatedColTags,formatedColExchRate] = [colTitle,colIva,colProfit,colTags,colExchRate].map(col=>formatOptionalCol(col))
    
    return jsonSheet.map(element=>{
        const optionalValue = (formatedCol:number|null)=>(typeof formatedCol === 'number' && element[formatedCol]) || null
        return {
            codigo:element[formatedColCod].toString(),
            titulo:(formatedColTitle !== null && element[formatedColTitle].toString()) || null, 
            costo:Number(element[formatedColCost]),
            iva:Number(optionalValue(formatedColIva)),
            rentabilidad:Number(optionalValue(formatedColProfit)),
            cotizacion:optionalValue(formatedColExchRate) as string|null,
            tagsId:optionalValue(formatedColTags) !== null?(optionalValue(formatedColTags) as string).split(',').filter(tagId=>tagId):[]
        }
    })
}

export const getListaItemsFromSheetItemsInProducts = ({products,xlsxWorkbook,overWrite,xlsxListaItemsList,sheetName,defaultExchRate,defaultIva,defaultProfit,...sheetCols}:GetListaItemsFromSheetItemsInProductsParams):ListaItem[]=>{
    const jsonSheet = sheetToJson({xlsxWorkbook,sheetName});
    const formatedJsonSheet = formatJsonSheet({jsonSheet,...sheetCols});
    const xlsxListasItemsCodigos = (overWrite === false && xlsxListaItemsList.flatMap(({items})=>items.map(({codigo})=>codigo))) || []
    
    const serializedFormatedJsonSheet = formatedJsonSheet.reduce((acc,item)=>{
        const isInXlsxListasItemsCodigos = xlsxListasItemsCodigos.some(codigo=>codigo === item.codigo)
        if(!isInXlsxListasItemsCodigos)
        acc[item.codigo]=item;
        return acc
    },{} as Record<string,FormatedJsonSheetItem>)

    const unifiedProducts = Object.values(products).flatMap((accountProducts,index)=>accountProducts.map(product=>({...product,account:index?'secondary':'main'})))

    const productsInSheetItems = unifiedProducts.reduce((acc,{account,...product})=>{
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

    const allSheetItems = Object.keys(serializedFormatedJsonSheet).reduce((acc,codigo)=>{
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
    },productsInSheetItems)
    
    return Object.values(allSheetItems)
}

export const getListaItemsFromSheetItemsInProductsWithApi = async (params:GetListaItemsFromSheetItemsInProductsParams)=>{
    const endpoint = LOCALHOST+'/api/xlsx/getListaItemsFromSheetItemsInProducts';
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

export const genResultingItems = (xlsxSheetItems:ListaItem[],xlsxListaItemsList:XlsxListaItems[]):ListaItem[]=>{
    const xlsxListaItemsFromXlsxListaItemsList = xlsxListaItemsList.map(({items})=>(items));
    return [xlsxSheetItems,...xlsxListaItemsFromXlsxListaItemsList].reduce((acc,listaItems)=>{
        const listaItemsCodigos = listaItems.map(({codigo})=>codigo)
        const accWithoutCurrentListaItemsCodigos = acc.filter((accItem)=>(
            !listaItemsCodigos.some(codigo=>codigo===accItem.codigo))
        )
        return [...listaItems,...accWithoutCurrentListaItemsCodigos];
    },[] as ListaItem[])
}