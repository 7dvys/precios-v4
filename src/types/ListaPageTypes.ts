import { Lista } from "./Listas";

export type ListaPageProps = {
    listaId:number,
}

export type ListaProps = Omit<ListaPageProps,'cotizacionesUtilsDependencies'> & {
    lista:Lista
}