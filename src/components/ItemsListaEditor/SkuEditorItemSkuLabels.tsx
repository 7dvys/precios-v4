import addSkuModalStyles from '@/styles/addSkuModal.module.css' 
import { AccountType } from '@/types/Config'
import { Product } from '@/types/Contabilium'
import { Products } from '@/types/Products'
import { AddListaItemSku, RemoveListaItemSku } from '@/types/UseListasTypes'

export const SkuEditorItemSkuLabels:React.FC<{
    listaItemCbProducts:Products,
    removeItemSku:RemoveListaItemSku|undefined,
    addItemSku:AddListaItemSku|undefined,
    listaItemCodigo:string,
}> = ({listaItemCbProducts,removeItemSku,listaItemCodigo,addItemSku})=>{

    const labels = (Object.entries(listaItemCbProducts) as [AccountType,Product[]][]).flatMap(([account,products]):[Product,AccountType,()=>void][]=>
        products.map(product=>{
            const {Codigo:sku} = product;
            let onClickHandler = undefined;

            if(removeItemSku !== undefined)
            onClickHandler = ()=>{
                if(confirm(`Desea ELIMINAR el sku ${sku} de la cuenta ${account==='main'?'primaria':'secundaria'}?`))
                removeItemSku({codigo:listaItemCodigo,sku,account})
            }

            if(addItemSku !== undefined)
              onClickHandler = ()=>{
                if(confirm(`Desea AGREGAR el sku ${sku} a la cuenta ${account==='main'?'primaria':'secundaria'}?`))
                addItemSku({codigo:listaItemCodigo,newSku:sku,account})
            }

            return [product,account,onClickHandler as ()=>void];
        })
    )
    
    const title = removeItemSku === undefined?'agregar':'eliminar';
    
    return (
        <>
            {labels.map(([{Nombre,Codigo},account,removeItemSKuHandler],index)=>
                <div key={index} onClick={removeItemSKuHandler} title={title} className={"flex-column "+addSkuModalStyles.addedSkuLabel}>
                    <p><strong>{Nombre}</strong></p>
                    <div className='flex-row flex-gap-l'>
                        <p><strong>sku: </strong>{Codigo}</p>
                        <p><strong>cuenta: </strong>{account === 'main'?'primaria':'secundaria'}</p>     
                    </div>
                </div>
            )}
        </>
    )
}