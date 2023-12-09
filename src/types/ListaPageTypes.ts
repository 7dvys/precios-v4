import { AgregarPageProps } from "./AgregarTypes";
import { Cotizaciones } from "./Cotizaciones";
import { Lista } from "./Listas";

export type ListaPageProps = {
    listaId:number,
} & Omit<AgregarPageProps,'vendors'>

export type ListaProps = Omit<ListaPageProps,'cotizacionesUtilsDependencies'|'listaId'> & {
    cotizaciones:Cotizaciones
    lista:Lista
}