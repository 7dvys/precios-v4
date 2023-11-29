import { Lista, ListaItem } from "@/types/Listas";

export const genItemsFromLista = ({lista,xlsxSheetItems}:{lista:Lista,xlsxSheetItems:ListaItem[]}):ListaItem[]=>{
    const {items} = lista;

    return [items,xlsxSheetItems].reduce((acc,listaItems)=>{
        const listaItemsCodigos = listaItems.map(({codigo})=>codigo)
        const accWithoutCurrentListaItemsCodigos = acc.filter((accItem)=>(
            !listaItemsCodigos.some(codigo=>codigo===accItem.codigo))
        )
        return [...listaItems,...accWithoutCurrentListaItemsCodigos];
    },[] as ListaItem[])
}