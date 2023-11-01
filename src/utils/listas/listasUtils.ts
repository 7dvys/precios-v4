import { Lista, ListaItem, Tag } from "@/types/Listas";

type ListaSearchCriteria = { searchTitulo: string; searchProveedorId: number };


export const listasUtils = ({listas}:{listas:Lista[]})=>{
    
    const setLista = ({titulo,proveedorId,tags,items,type}:Lista)=>{
        const newLista:Lista = {titulo,proveedorId,tags,items,type}
        listas.push(newLista);
    }
    
    const getLista = ({ searchTitulo, searchProveedorId }:ListaSearchCriteria) => {
        return listas.find(({ titulo, proveedorId }) => {
            const isSameTitulo = searchTitulo === titulo;
            const isSameProveedor = searchProveedorId === proveedorId;
            const isSetProveedor = searchProveedorId;
    
            return (isSameTitulo && isSameProveedor) || (isSameTitulo && !isSetProveedor);
        });
    }

    const modifyLista = ({searchTitulo,searchProveedorId}:ListaSearchCriteria,callback:(lista:Lista)=>void)=>{
        listas.forEach(lista=>{
            if(lista.titulo === searchTitulo && lista.proveedorId === searchProveedorId){
                callback(lista);
            }
        })
    }

    const addItemToLista = ({searchTitulo,searchProveedorId}:ListaSearchCriteria, item:ListaItem)=>{
        modifyLista({searchProveedorId,searchTitulo},(lista)=>{
            lista.items.push(item);
        })
    } 

    const isSetTag = ({lista,tag}:{lista:Lista,tag:Tag})=>{
        return lista.tags.some(({id})=>id === tag.id)
    }
    
    const addTagToLista = ({searchTitulo,searchProveedorId}:ListaSearchCriteria,tag:Tag)=>{
        modifyLista({searchProveedorId,searchTitulo},(lista)=>{
            !isSetTag && lista.tags.push(tag);
        })
    }

    return {setLista,getLista,addItemToLista,addTagToLista}
}