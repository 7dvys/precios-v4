import { FormatedJsonSheet, JsonSheet, SheetCols } from "@/types/AgregarTypes";
import { letterToNumber } from "../letterToNumber";

export const formatJsonSheet = ({jsonSheet,colCod,colTitle,colCost,colIva,colProfit,colTags,colExchRate}:{jsonSheet:JsonSheet} & SheetCols):FormatedJsonSheet=>{
    const formatCol = (col:string|number)=>(typeof col === 'number'?col:letterToNumber(col));
    const formatOptionalCol = (col:string|number|null)=>(col !== null && formatCol(col)-1 || null)
    const formatedColCod = formatCol(colCod)-1;
    const formatedColCost = formatCol(colCost)-1;
    const [formatedColTitle,formatedColIva,formatedColProfit,formatedColTags,formatedColExchRate] = [colTitle,colIva,colProfit,colTags,colExchRate].map(col=>formatOptionalCol(col))
    
    return jsonSheet.map(element=>{
        const optionalValue = (formatedCol:number|null)=>{
            return (typeof formatedCol === 'number' && element[formatedCol] !== undefined && element[formatedCol] !== null)?
            element[formatedCol]:
            null;
        }

        let codigo = 'sin codigo';
        if(element[formatedColCod] !== undefined && element[formatedColCod] !== null)
        codigo = element[formatedColCod].toString();

        let titulo = 'sin titulo';
        if(formatedColTitle !== null && element[formatedColTitle] !== undefined && element[formatedColTitle] !== null)
        titulo = element[formatedColTitle].toString();

        let costo = 0;
        if(element[formatedColCost] !== null && element[formatedColCost] !== undefined && !isNaN(Number(element[formatedColCost])))
        costo = Number(element[formatedColCost]);

        let iva = 0, rentabilidad = 0;
        if(!isNaN(Number(optionalValue(formatedColIva))))
        iva = Number(optionalValue(formatedColIva));

        if(!isNaN(Number(optionalValue(formatedColProfit))))
        rentabilidad = Number(optionalValue(formatedColProfit));
        
        return {
            codigo,
            titulo,
            costo,
            iva,
            rentabilidad,
            cotizacion:optionalValue(formatedColExchRate) as string|null,
            tagsId:optionalValue(formatedColTags) !== null?(optionalValue(formatedColTags) as string).split(',').filter(tagId=>tagId):[]
        }
    })
}