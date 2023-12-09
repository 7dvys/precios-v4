import containerStyles from '@/styles/containers.module.css'
import { ModalStyles } from "@/styles/ModalStyles";
import { AccountType } from '@/types/Config';
import { Product, RubrosWithSubRubrosPerAccount } from '@/types/Contabilium';
import { ListaItem } from '@/types/Listas';
import { Products } from '@/types/Products';
import { AddListaItemSku, RemoveListaItemSku } from '@/types/UseListasTypes';
import { serializeProducts } from '@/utils/serializeProducts';
import { useRef, useState } from "react"
import { SkuEditorItemSkuLabels } from './SkuEditorItemSkuLabels';
import { SkuEditorCreateSku } from './SkuEditorCreateSku';
import { populateDefaultProduct } from '@/utils/contabilium/populateDefaultProduct';

export type SkuEditorModalProps = {
    listaItem:ListaItem,
    productsWithNewProducts:Products;
    rubrosWithSubRubros:RubrosWithSubRubrosPerAccount;
    removeItemSku:RemoveListaItemSku
    addItemSku:AddListaItemSku
    getCbItemByCodigo:({account,codigo}:{account:AccountType,codigo:string})=>Promise<Product|{error:string}>
    createItemSku:(params:{product:Product,account:AccountType,codigo:string})=>void;
    removeFirstTableItemIdToEdit:()=>void;
}


export const SkuEditorModal:React.FC<SkuEditorModalProps> = ({listaItem,addItemSku,createItemSku,rubrosWithSubRubros,removeItemSku,removeFirstTableItemIdToEdit,getCbItemByCodigo,productsWithNewProducts})=>{
    const serializedProducts = serializeProducts({products:productsWithNewProducts});
    const {codigo,titulo,cbItemSkus,costo,rentabilidad,iva} = listaItem
    const [createItem,setCreateItem] = useState<boolean>(false);

    const getFormValues = ()=>{
        const sku = (skuRef.current as HTMLInputElement).value;
        const account = (accountRef.current as HTMLSelectElement).value as AccountType;

        return {sku,account};
    }
    
    const confirmHandler = ()=>{
        removeFirstTableItemIdToEdit();
    }

    const addItemSkuHandler = async ()=>{
        const {sku,account} = getFormValues();

        const alreadyExistOnListaItem = cbItemSkus[account].some(cbItemSku=>cbItemSku===sku)
        if(alreadyExistOnListaItem)
        return alert('El sku ya existe en este item.')

        if(sku === '' || !confirm(`Desea agregar el sku ${sku} en la cuenta ${account}?`))
        return;
    
        const alreadyExistOnProducts = sku in serializedProducts[account];

        if(alreadyExistOnProducts)
        return addItemSku({codigo,newSku:sku,account});

        const cbItem = await getCbItemByCodigo({account,codigo:sku})
        if('error' in cbItem)
        return alert(`No existe el sku "${sku}" en la cuenta ${account==='main'?'primaria':'secundaria'}.`)

        return addItemSku({codigo,newSku:sku,account});
    }

    const createItemSkuHandler = ()=>{
        const {sku,account} = getFormValues();
        const newProductTitle = (newProductTitleRef.current as HTMLInputElement).value;
        const newProductStock = Number((newProductStockRef.current as HTMLInputElement).value);
        
        const skuAlreadyExistOnProducts = sku in serializedProducts[account];
        if(skuAlreadyExistOnProducts)
        return alert(`El sku ${sku} ya existe en la cuenta ${account==='main'?'principal':'secundaria'}.`);
        
        
        if(sku.length === 0)
        return alert('El sku no puede estar vacio.');
        
        if(newProductTitle.length === 0)
        return alert('El titulo no puede estar vacio.');

        if(isNaN(newProductStock) || newProductStock <= 0)
        return alert('El stock debe ser un numero mayor a 0.')
    
        const idRubro = rubrosWithSubRubros[account][0].Id.toString();
        const precio = costo*((rentabilidad/100)+1);
        const precioFinal = precio*((iva/100)+1);
        
        const productValues = {
            Nombre:newProductTitle, 
            Tipo:'P', 
            Codigo:sku, 
            CostoInterno:costo,
            Precio:precio, 
            PrecioFinal:precioFinal,
            Rentabilidad:rentabilidad,
            Iva:iva, 
            Estado:'A', 
            IdRubro:idRubro, 
            Stock:newProductStock
        };

        const newProduct = populateDefaultProduct(productValues);
        createItemSku({product:newProduct,account,codigo});
    }

    const EditorButtons:React.ReactNode = createItem===false?
    <>
        <input onClick={addItemSkuHandler} type="button" value={'agregar'}/>
        <input onClick={()=>{setCreateItem(true)}} type="button" value={'crear'}/>
    </>:
    <>
        <input onClick={createItemSkuHandler} type="button" className='bg-green' value={'aceptar'}/>
        <input onClick={()=>{setCreateItem(false)}} type="button" value={'listo'}/>
    </>
    
    const listaItemCbProducts = (Object.entries(cbItemSkus) as [AccountType,string[]][]).reduce((acc,[account,accountSkus])=>{
        accountSkus.forEach(sku=>{
            acc[account].push(serializedProducts[account][sku])
        })
        return acc;
    },{main:[],secondary:[]} as Record<AccountType,Product[]>)
    
    const listaItemCbProductsSuggestions = (Object.entries(productsWithNewProducts) as [AccountType,Product[]][]).reduce((acc,[account,accountProducts])=>{
        const suggestions = accountProducts.filter(product=>{
            const {Codigo:productSku,Descripcion:productCodigo} = product
           
            const isInCbItemSkus = cbItemSkus[account].some(sku=>sku===productSku);
            const isSameSku = codigo === productSku;
            const isSameCodigo = codigo === productCodigo;

            return (!isInCbItemSkus && (isSameCodigo || isSameSku))
        })
        acc[account].push(...suggestions);
        return acc
    },{main:[],secondary:[]} as Record<AccountType,Product[]>)
 
    const renderListaItemCbProducts = listaItemCbProducts.main.length > 0 || listaItemCbProducts.secondary.length > 0
    const renderListaItemCbProductsSuggestions = listaItemCbProductsSuggestions.main.length > 0 || listaItemCbProductsSuggestions.secondary.length > 0
    
    const skuRef = useRef<HTMLInputElement>(null);
    const accountRef = useRef<HTMLSelectElement>(null);
    const newProductTitleRef = useRef<HTMLInputElement>(null)
    const newProductStockRef = useRef<HTMLInputElement>(null)
        
    return (
        <div style={ModalStyles}>
            <div className={containerStyles.container+' flex-column flex-gap-l'}>
                <h3>Editor de SKU</h3>

                <div className={"flex-row flex-gap-m"}>
                    <p><strong>codigo: </strong>{codigo}</p>
                    <p><strong>item: </strong>{titulo}</p>
                </div>

                <div className="flex-row flex-gap-s flex-grow">
                    <input ref={skuRef} type="text" placeholder="sku"/>
                    <select ref={accountRef} name="cuenta" id="cuenta">
                        <option value="main">primaria</option>
                        <option value="secondary">secundaria</option>
                    </select>
                    {EditorButtons}
                </div>

                {createItem && <SkuEditorCreateSku newProductStockRef={newProductStockRef} newProductTitleRef={newProductTitleRef} title={titulo} codigo={codigo}/>}

                {renderListaItemCbProducts && <div>
                    <h3>Items</h3>
                    <SkuEditorItemSkuLabels listaItemCodigo={codigo} listaItemCbProducts={listaItemCbProducts} removeItemSku={removeItemSku} addItemSku={undefined}/>
                </div>}

                {renderListaItemCbProductsSuggestions && <div>
                    <h3>Sugerencias</h3>
                    <SkuEditorItemSkuLabels listaItemCodigo={codigo} listaItemCbProducts={listaItemCbProductsSuggestions} removeItemSku={undefined} addItemSku={addItemSku}/>
                </div>}
  
                <div className="flex-row flex-gap-s">
                    <input onClick={confirmHandler} type="button" value="listo" />
                </div> 
            </div>
        </div>
    )
}