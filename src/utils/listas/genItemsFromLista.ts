import { ListaItem } from "@/types/Listas";

export const genItemsFromLista = ({listaItems,tmpXlsxSheetItems}:{listaItems:ListaItem[],tmpXlsxSheetItems:ListaItem[]}):ListaItem[]=>{

    return [listaItems,tmpXlsxSheetItems].reduce((acc,listaItems)=>{
        const listaItemsCodigos = listaItems.map(({codigo})=>codigo)
        const accWithoutCurrentListaItemsCodigos = acc.filter((accItem)=>(
            !listaItemsCodigos.some(codigo=>codigo===accItem.codigo))
        )
        return [...listaItems,...accWithoutCurrentListaItemsCodigos];
    },[] as ListaItem[])
}