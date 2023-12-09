import { ListaItem } from "@/types/Listas";

export const serializeListaItems = ({listaItems}:{listaItems:ListaItem[]})=>{
    return listaItems.reduce((acc,listaItem)=>{
        const {codigo} = listaItem;
        acc[codigo] = listaItem;
        return acc;
    },{} as Record<string,ListaItem>)
}