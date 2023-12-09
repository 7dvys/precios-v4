import { Lista, ListaItem } from "@/types/Listas";

export const genItemsFromInferedLista = ({lista}:{lista:Lista}):ListaItem[]=>{
    const {inferedItems} = lista;

    // const itemsFromXlsxSheets = xlsxSheets.flatMap(xlsxSheet=>xlsxSheet.items)

    return [inferedItems].reduce((acc,listaItems)=>{
        const listaItemsCodigos = listaItems.map(({codigo})=>codigo)
        const accWithoutCurrentListaItemsCodigos = acc.filter((accItem)=>(
            !listaItemsCodigos.some(codigo=>codigo===accItem.codigo))
        )
        return [...listaItems,...accWithoutCurrentListaItemsCodigos];
    },[] as ListaItem[])
}