import addSkuModalStyles from '@/styles/addSkuModal.module.css' 
import { AccountType } from '@/types/Config'
import { Deposits, ObservacionesWithoutTags, Product, ProductStockByDeposits, StockByDeposit } from '@/types/Contabilium'
import { Products } from '@/types/Products'
import { AddListaItemSku, RemoveListaItemSku } from '@/types/UseListasTypes'
import { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react'
import { ContabiliumContext } from '@/contexts/ContabiliumContext'
import { getAccountProductStockByDeposits, updateAccountProductStock } from '@/services/contabilium/accountProducts'
import { DecodedObject, simpleDataSerializer } from '@/utils/simpleDataSerializer'

type ItemSkuLabelsProps = {
    listaItemCbProducts:Products,
    listaItemCodigo:string,
}

type ListaItemSkuLabelsProps = ItemSkuLabelsProps & {
    deposits:Deposits,
    removeItemSku:RemoveListaItemSku,
};

type ListaSuggestItemSkuLabelsProps = ItemSkuLabelsProps & {
    addItemSku:AddListaItemSku,
};


const ItemLabel:React.FC<{children:React.ReactNode,product:Product,account:AccountType}> = ({children,product:{Id,Nombre,Codigo},account})=>{
 

    return (
        <div key={Id} className={"flex-column flex-space-between flex-gap-l "+addSkuModalStyles.addedSkuLabel}>
            <div className='flex-row flex-gap-s flex-wrap'>
                    <p><strong>sku: </strong>{Codigo}</p>
                <p><strong>{Nombre}</strong></p>
                    <p><strong>cuenta: </strong>{account === 'main'?'primaria':'secundaria'}</p>     
            </div>
            {children}
        </div>
    )
}

const CbItemLabelModify:React.FC<{
    listaItemCodigo:string,
    product:Product;
    account:AccountType;
    deposits:Deposits;
    removeItemSku:RemoveListaItemSku;
}> = ({product,account,deposits,listaItemCodigo,removeItemSku})=>{
    const {updateProducts:updateContextProducts,tokens} = useContext(ContabiliumContext)
    const [productStockByDeposits,setProductStockByDeposits] = useState<ProductStockByDeposits|null>(null);
    const [enlazadoMl,setEnlazadoMl] = useState<'si'|'sin revisar'>('sin revisar');

    const editStockByDeposit = ({depositName,newStock}:{depositName:string,newStock:number})=>{
        if(productStockByDeposits === null)
        return;

        setProductStockByDeposits(current=>{
            if(current === null)
            return current
            
            if(!(depositName in current))
            return current

            if(current[depositName] === null)
            return current;

            const stockByDeposit = current[depositName] as StockByDeposit;

            const newStockByDeposit:StockByDeposit = {...stockByDeposit,StockConReservas:newStock,StockActual:newStock+stockByDeposit.StockReservado};

            const newProductStockByDeposits = {...current,[depositName]:newStockByDeposit};
            return newProductStockByDeposits;
        })
    }
    
    const [selectedStockByDeposit,setSelectedStockByDepositWithDepositName] = useState<StockByDeposit&{depositName:string}|null>(null); 

    const {decoder} = simpleDataSerializer();
    const decodedObservaciones = decoder<ObservacionesWithoutTags>(product.Observaciones) as DecodedObject<ObservacionesWithoutTags>;

    const init = async ()=>{
        if('enlazadoMl' in decodedObservaciones)
        setEnlazadoMl(decodedObservaciones.enlazadoMl[0]);

        else
        setEnlazadoMl('sin revisar');
        
        const productStockByDeposits = await getAccountProductStockByDeposits({accountDeposits:deposits[account],sku:product.Codigo,token:tokens[account]}) 
        setProductStockByDeposits(productStockByDeposits)

        console.log(productStockByDeposits)

        if(Object.values(productStockByDeposits).length===0)
        return 
    
        const [depositName,stockByDeposit] = Object.entries(productStockByDeposits)[0];

        if(stockByDeposit === null)
        return;

        const stockByDepositWithDepositName = {...stockByDeposit,depositName};
        setSelectedStockByDepositWithDepositName(stockByDepositWithDepositName);

        if(stockRef.current !== null)
        (stockRef.current as HTMLInputElement).value = stockByDeposit.StockConReservas.toString()
    }
    
    useEffect(()=>{init()},[])

    const removeHandler = ()=>{
        if(confirm(`Desea ELIMINAR el sku ${product.Codigo} de la cuenta ${account==='main'?'primaria':'secundaria'}?`))
        removeItemSku({codigo:listaItemCodigo,sku:product.Codigo,account})
    }
        
    const stockRef = useRef<HTMLInputElement>(null)
    
    if(productStockByDeposits === null)
    return 'cargando stock...';

    const stock = Object.values(productStockByDeposits).reduce((sum,stockDeposit)=>{
        if(stockDeposit!==null)
        sum += stockDeposit.StockConReservas;
        
        return sum
    },0)
    
    const onChangeDepositHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        const depositName= (event.target as HTMLSelectElement).value;
        const selectedStockByDeposit = productStockByDeposits[depositName];

        if(selectedStockByDeposit === null)
        return;
        
        (stockRef.current as HTMLInputElement).value = selectedStockByDeposit.StockConReservas.toString()
        setSelectedStockByDepositWithDepositName({...selectedStockByDeposit,depositName});
    }

    const onChangeEnlazadoHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        const enlazadoValue = (event.target as HTMLSelectElement).value

        if(enlazadoValue === 'si' || enlazadoValue === 'sin revisar')
        setEnlazadoMl(enlazadoValue);
    }

    const onChangeStockHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        const newStock = Number((event.target as HTMLInputElement).value);

        if(selectedStockByDeposit === null)
        return;
    
        const depositName = selectedStockByDeposit.depositName
        editStockByDeposit({newStock,depositName})
    }

    const updateCbProductHandler = async ()=>{
        if(selectedStockByDeposit === null)
        return;

        const {decoder,encoder} = simpleDataSerializer();
        const decodedObservaciones = decoder(product.Observaciones) as DecodedObject<ObservacionesWithoutTags>;

        const newObservaciones:DecodedObject<ObservacionesWithoutTags> = {...decodedObservaciones,enlazadoMl:[enlazadoMl]}

        const newProduct:Product = {...product,Stock:stock,Observaciones:encoder(newObservaciones)};
        const newProducts:Products = {main:[],secondary:[],[account]:[newProduct]}

        const updateOk = await updateAccountProductStock({token:tokens[account],productId:product.Id,accountDeposits:deposits[account],productStockByDeposits})

        if(!updateOk)
        return alert(`error al actualizar el producto ${product.Nombre}.`);;
    
        alert(`el producto ${product.Nombre} ha sido actualizado.`);
        updateContextProducts({newProducts});
    } 
    
    const productStockByDepositsOptions = Object.keys(productStockByDeposits).map((nombre)=>{
        return <option key={nombre} value={nombre}>{nombre}</option>
    })
    
    return (
        <div className='flex-row flex-space-between'>
            <div className='flex-row flex-gap-s flex-align-center'>
                <strong>enlazado: </strong>  
                <select  name="enlazadoMl" onChange={onChangeEnlazadoHandler} value={enlazadoMl}>
                    <option value="si">si</option>
                    <option value="sin revisar">sin revisar</option>
                </select>  
                <strong>deposito</strong>
                <select onChange={onChangeDepositHandler}>{productStockByDepositsOptions}</select>
                <input 
                    key={product.Codigo+account+listaItemCodigo} 
                    ref={stockRef} 
                    type="number" 
                    defaultValue={selectedStockByDeposit!==null?selectedStockByDeposit.StockConReservas:0}
                    onChange={onChangeStockHandler}
                />
                <strong>stock: </strong>{stock}
            </div>
            <div className='flex-row flex-gap-s flex-align-center'>

                <input type="button" onClick={updateCbProductHandler} value={"actualizar"}/>
                <input type="button" onClick={removeHandler} value={"quitar"}/>
            </div>
        </div>
    )
}

export const ListaCbItemLabels:React.FC<ListaItemSkuLabelsProps> = ({deposits,listaItemCbProducts,listaItemCodigo,removeItemSku})=>{

    
    const Labels =  (Object.entries(listaItemCbProducts) as [AccountType,Product[]][]).flatMap(([account,products])=>{

        return products.map((product)=>{

            return (<Fragment key={account+product.Codigo}>
                <ItemLabel product={product} account={account}>
                    <CbItemLabelModify listaItemCodigo={listaItemCodigo} product={product} account={account} deposits={deposits} removeItemSku={removeItemSku}/>
                    {/* <div onClick={()=>changeStockHandler({item:product,account})} title='Modificar stock'>{PenIcon}</div> */}
                    {/* <div onClick={()=>{removeHandler({codigo:listaItemCodigo,sku:product.Codigo,account})}} title='Remover Item'>{Trash}</div> */}
                </ItemLabel>
            </Fragment>)
        }
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
                <input type='button' onClick={()=>{addHandler({codigo:listaItemCodigo,newSku:product.Codigo,account})}} title='Agregar Item' value={'agregar'}/>
            </ItemLabel>
        </Fragment>
        )
    })
    
    return (<>{Labels}</>)
}

