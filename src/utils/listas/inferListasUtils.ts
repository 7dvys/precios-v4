import { AccountType } from "@/types/Config";
import { Lista, ListaItem, Tag } from "@/types/Listas";

type ListaSearchCriteria = { searchTitulo: string; searchProveedorId: number };


export const inferListasUtils = ({listas}:{listas:Lista[]})=>{
    
    const setLista = ({titulo,proveedorId,tags,items,type,proveedor}:Lista)=>{
        const newLista:Lista = {titulo,proveedorId,proveedor,tags,items,type,} as Lista
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

    const updateListaType = (listaSearchCriteria:ListaSearchCriteria,type:AccountType|'both')=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            lista.type = type;
        })
    }

    const isSetItemOnLista = (listaSearchCriteria:ListaSearchCriteria,item:ListaItem)=>{
        const lista = getLista(listaSearchCriteria);
        if(lista)
        return lista.items.some(({codigo})=>codigo===item.codigo)

        return false
    }

    const addItemToLista = (listaSearchCriteria:ListaSearchCriteria, item:ListaItem)=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            lista.items.push(item);
        })
    } 

    const addCbItemSkuToItemLista = (listaSearchCriteria:ListaSearchCriteria,item:ListaItem,account:'main'|'secondary',sku:string)=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            lista.items.forEach((listaItem)=>{
                if(listaItem.codigo === item.codigo)
                listaItem.cbItemSkus[account].push(sku);
            })
        })
    } 

    const updateItem = (listaSearchCriteria:ListaSearchCriteria,item:ListaItem)=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            const prevItems = lista.items
            lista.items = prevItems.map(prevItem=>{
                if(prevItem.codigo == item.codigo)
                return {...prevItem,...item};

                return prevItem
            })
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

    return {setLista,getLista,addItemToLista,addCbItemSkuToItemLista,updateListaType,updateItem,isSetItemOnLista,addTagToLista}
}