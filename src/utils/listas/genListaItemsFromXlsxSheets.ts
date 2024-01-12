import { XlsxSheet } from "@/types/AgregarTypes";
import { ListaItem } from "@/types/Listas";

export const genListaItemsFromXlsxSheets = (xlsxSheets:XlsxSheet[])=>{
    if(xlsxSheets === undefined)
    return [];

    const xlsxListaItemsFromXlsxSheets = xlsxSheets.map(({items})=>(items));
    
    const items = xlsxListaItemsFromXlsxSheets.reduce((acc,listaItems)=>{
        const listaItemsCodigos = listaItems.map(({codigo})=>codigo)
        const accWithoutCurrentListaItemsCodigos = acc.filter((accItem)=>(
            !listaItemsCodigos.some(codigo=>codigo===accItem.codigo))
        )
        return [...listaItems,...accWithoutCurrentListaItemsCodigos];
    },[] as ListaItem[])

    return items;
}