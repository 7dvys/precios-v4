import addSkuModalStyles from '@/styles/addSkuModal.module.css' 
import { AccountType } from '@/types/Config'
import { Product } from '@/types/Contabilium'
import { Products } from '@/types/Products'
import { AddListaItemSku, RemoveListaItemSku } from '@/types/UseListasTypes'
import { PenIcon } from '../icons/Pen'
import { Trash } from '../icons/Trash'
import { Plus } from '../icons/Plus'
import { Fragment, useContext } from 'react'
import { ContabiliumContext } from '@/contexts/ContabiliumContext'

type ItemSkuLabelsProps = {
    listaItemCbProducts:Products,
    listaItemCodigo:string,
}

type ListaItemSkuLabelsProps = ItemSkuLabelsProps & {
    removeItemSku:RemoveListaItemSku,
};

type ListaSuggestItemSkuLabelsProps = ItemSkuLabelsProps & {
    addItemSku:AddListaItemSku,
};


const ItemLabel:React.FC<{children:React.ReactNode,product:Product,account:AccountType}> = ({children,product:{Id,Nombre,Codigo,Stock},account})=>{
    return (
        <div key={Id} className={"flex-column "+addSkuModalStyles.addedSkuLabel}>
            <p><strong>{Nombre}</strong></p>
            <div className='flex-row flex-space-between'>
                <div className='flex-row flex-gap-l'>
                    <p><strong>sku: </strong>{Codigo}</p>
                    <p><strong>stock: </strong>{Stock}</p>
                    <p><strong>cuenta: </strong>{account === 'main'?'primaria':'secundaria'}</p>     
                </div>
                <div className='flex-row flex-gap-m'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export const ListaCbItemLabels:React.FC<ListaItemSkuLabelsProps> = ({listaItemCbProducts,listaItemCodigo,removeItemSku})=>{
    const {updateProducts:updateContextProducts} = useContext(ContabiliumContext)
    
    const removeHandler = ({sku,account,codigo}:{sku:string,account:AccountType,codigo:string})=>{
        if(confirm(`Desea ELIMINAR el sku ${sku} de la cuenta ${account==='main'?'primaria':'secundaria'}?`))
        removeItemSku({codigo,sku,account})
    }

    const changeStockHandler = ({item,account}:{item:Product,account:AccountType})=>{
        const newStock = Number(prompt('nuevo stock',item.Stock.toString()));
        const newItem:Product = {...item,Stock:newStock}
        const newProducts:Products = {main:[],secondary:[],[account]:[newItem]}
        updateContextProducts({newProducts})
    } 
    
    const Labels =  (Object.entries(listaItemCbProducts) as [AccountType,Product[]][]).flatMap(([account,products])=>{
        return products.map((product,index)=>
        <Fragment key={account+index}>
            <ItemLabel product={product} account={account}>
                <div onClick={()=>changeStockHandler({item:product,account})} title='Modificar stock'>{PenIcon}</div>
                <div onClick={()=>{removeHandler({codigo:listaItemCodigo,sku:product.Codigo,account})}} title='Remover Item'>{Trash}</div>
            </ItemLabel>
        </Fragment>
        )
    })
    
    return (<>{Labels}</>)
}

export const ListaCbItemSuggestLabels:React.FC<ListaSuggestItemSkuLabelsProps> = ({listaItemCbProducts,listaItemCodigo,addItemSku})=>{
    
    const addHandler = ({newSku,account,codigo}:{newSku:string,account:AccountType,codigo:string})=>{
        if(confirm(`Desea agregar el sku ${newSku} a la cuenta ${account==='main'?'primaria':'secundaria'}?`))
        addItemSku({codigo,newSku,account})
    }
    
    const Labels =  (Object.entries(listaItemCbProducts) as [AccountType,Product[]][]).flatMap(([account,products])=>{
        return products.map((product,index)=>
        <Fragment key={account+index}>
            <ItemLabel product={product} account={account}>
                <div onClick={()=>{addHandler({codigo:listaItemCodigo,newSku:product.Codigo,account})}} title='Agregar Item'>{Plus}</div>
            </ItemLabel>
        </Fragment>
        )
    })
    
    return (<>{Labels}</>)
}

