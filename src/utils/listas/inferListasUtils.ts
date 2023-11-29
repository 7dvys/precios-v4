import { AccountType } from "@/types/Config";
import { Lista, ListaItem, Tag } from "@/types/Listas";

type ListaSearchCriteria = { searchName: string};


export const inferListasUtils = ({listas}:{listas:Lista[]})=>{
    
    const setLista = (lista:Lista)=>{
        const newLista:Lista = lista 
        listas.push(newLista);
    }
    
    const getLista = ({ searchName }:ListaSearchCriteria) => {
        return listas.find(({ name }) => searchName === name);
    }

    const modifyLista = ({searchName}:ListaSearchCriteria,callback:(lista:Lista)=>void)=>{
        listas.forEach(lista=>{
            if(lista.name === searchName){
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
        return lista.inferedItems.some(({codigo})=>codigo===item.codigo)

        return false
    }

    const addItemToLista = (listaSearchCriteria:ListaSearchCriteria, item:ListaItem)=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            lista.inferedItems.push(item);
        })
    } 

    const addCbItemSkuToItemLista = (listaSearchCriteria:ListaSearchCriteria,item:ListaItem,account:'main'|'secondary',sku:string)=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            lista.inferedItems.forEach((listaItem)=>{
                if(listaItem.codigo === item.codigo)
                listaItem.cbItemSkus[account].push(sku);
            })
        })
    } 

    const updateItem = (listaSearchCriteria:ListaSearchCriteria,item:ListaItem)=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            const prevItems = lista.inferedItems
            lista.inferedItems = prevItems.map(prevItem=>{
                if(prevItem.codigo == item.codigo)
                return {...prevItem,...item};

                return prevItem
            })
        })
    }
    
    const addTagToLista = (listaSearchCriteria:ListaSearchCriteria,{tag,tagId}:{tag:Tag,tagId:string})=>{
        modifyLista(listaSearchCriteria,(lista)=>{
            lista.tags[tagId] = tag;
        })
    }

    return {setLista,getLista,addItemToLista,addCbItemSkuToItemLista,updateListaType,updateItem,isSetItemOnLista,addTagToLista}
}