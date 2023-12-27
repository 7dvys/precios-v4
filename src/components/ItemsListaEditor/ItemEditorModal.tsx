import containerStyles from '@/styles/containers.module.css'
import { AccountType } from '@/types/Config';
import { Product, RubrosWithSubRubrosPerAccount, Tokens } from '@/types/Contabilium';
import { ListaItem, Tags } from '@/types/Listas';
import { Products, SerializedProducts } from '@/types/Products';
import { AddListaItemSku, RemoveListaItemSku, UpdateListaItem } from '@/types/UseListasTypes';
import { useRef, useState } from "react"
import { ListaCbItemLabels, ListaCbItemSuggestLabels } from './SkuEditorItemSkuLabels';
import { SkuEditorCreateSku } from './SkuEditorCreateSku';
import { populateDefaultProduct } from '@/utils/contabilium/populateDefaultProduct';
import { createAccountProduct } from '@/services/contabilium/accountProducts';
import { LabelWrapper } from '../LabelWrapper';
import { genFinalCostPriceAndFinalPrice } from '@/utils/itemsListaEditor/genFinalCostPriceAndFinalPrice';
import { Cotizaciones } from '@/types/Cotizaciones';
import { Option } from '@/types/FormFields';
import { Options } from '../Options';
import { Modal } from '../Modal';

export type ItemEditorModal = {
    serializedProducts:SerializedProducts;
    clearTableItemIdToEditSkuList:()=>void
    cotizaciones:Cotizaciones,
    listaItem:ListaItem,
    productsWithNewProducts:Products;
    rubrosWithSubRubros:RubrosWithSubRubrosPerAccount;
    tags:Tags;
    tokens:Tokens
    removeItemSku:RemoveListaItemSku
    updateListaItem:UpdateListaItem;
    addItemSku:AddListaItemSku
    getCbItemByCodigo:({account,codigo}:{account:AccountType,codigo:string})=>Promise<Product|{error:string}>
    createItemSku:(params:{product:Product,account:AccountType,codigo:string})=>void;
    removeFirstTableItemIdToEdit:()=>void;
}


export const ItemEditorModal:React.FC<ItemEditorModal> = ({
    clearTableItemIdToEditSkuList,
    updateListaItem,
    serializedProducts,
    cotizaciones,
    tokens,
    tags,
    listaItem,
    addItemSku,
    createItemSku,
    rubrosWithSubRubros,
    removeItemSku,
    removeFirstTableItemIdToEdit,
    getCbItemByCodigo,
    productsWithNewProducts
})=>{

    const {codigo,titulo,cbItemSkus,costo,rentabilidad,iva,tagsId,cotizacion} = listaItem;
    const {price,finalPrice,finalCost,fixedCoeficient,porcentualCoeficient} = genFinalCostPriceAndFinalPrice({tags,tagsId,costo,rentabilidad,iva})
    const finalPriceDetailsTitle = `costo final: ${finalCost.toFixed(2)} (costo ${costo.toFixed(2)} + tag fijo ${fixedCoeficient.toFixed(2)} porcentual ${porcentualCoeficient.toFixed(2)}%)\nprecio: ${price.toFixed(2)} (costo final ${finalCost.toFixed(2)} + rentabilidad ${rentabilidad}%)\nprecio final (precio ${price.toFixed(2)} + iva ${iva}%)`


    const cotizacionesOptionList:Option[] = Object.entries(cotizaciones).map(([name,exchangeRate]:[string,number])=>({value:name,title:`${name} - ${exchangeRate}`}))
    
    const [createItem,setCreateItem] = useState<boolean>(false);

    const getFormValues = ()=>{
        const sku = (skuRef.current as HTMLInputElement).value;
        const account = (accountRef.current as HTMLSelectElement).value as AccountType;
    
        const finalCost = Number((finalCostRef.current as HTMLInputElement).value)
        const profit = Number((profitRef.current as HTMLInputElement).value)
        const iva = Number((ivaRef.current as HTMLInputElement).value)
        const tags = (tagsRef.current as HTMLInputElement).value.split(',').map(tagName=>tagName.trim()).filter(tagName=>tagName);
        const exchRate = (exchRateRef.current as HTMLSelectElement).value;

        return {sku,account,finalCost,profit,iva,tags,exchRate};
    }
    
    const confirmHandler = ()=>{
        removeFirstTableItemIdToEdit();
    }

    const cancelHandler = ()=>{
        clearTableItemIdToEditSkuList();
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

        createItemSku({product:cbItem,account,codigo})
    }

    const updateListaItemHandler = ()=>{
        if(!confirm('Desea actualizar el item?'))
        return;

        const {finalCost,profit,iva,tags,exchRate} = getFormValues()

        if(
            isNaN(finalCost) || finalCost === 0 ||
            isNaN(profit) || profit === 0 ||
            isNaN(iva) || iva === 0 
        )
        return alert('los valores deben ser numericos distintos a 0');

        updateListaItem({codigo,newItemValues:{costo:finalCost,rentabilidad:profit,iva,tagsId:tags,cotizacion:exchRate}})
    }

    const createItemSkuHandler = async ()=>{
        const {sku,account} = getFormValues();

        const newProductTitle = (newProductTitleRef.current as HTMLInputElement).value;
        const newProductStock = Number((newProductStockRef.current as HTMLInputElement).value);

        const skuAlreadyExistOnProducts = Object.keys(serializedProducts[account]).some(id=>id.toUpperCase() === sku.toUpperCase());

        if(skuAlreadyExistOnProducts)
        return alert(`El sku ${sku} ya existe en la cuenta ${account==='main'?'principal':'secundaria'}.`);
        
        if(sku.length === 0)
        return alert('El sku no puede estar vacio.');
        
        if(newProductTitle.length === 0)
        return alert('El titulo no puede estar vacio.');

        if(isNaN(newProductStock) || newProductStock <= 0)
        return alert('El stock debe ser un numero mayor a 0.')
    
        const idRubro = rubrosWithSubRubros[account][0].Id.toString();
        
        const {price,finalPrice} = genFinalCostPriceAndFinalPrice({tags,tagsId,costo,rentabilidad,iva})
        
        const productValues = {
            Nombre:newProductTitle, 
            Tipo:'P', 
            Codigo:sku, 
            CostoInterno:costo,
            Precio:price, 
            PrecioFinal:finalPrice,
            Rentabilidad:rentabilidad,
            Iva:iva, 
            Estado:'A', 
            IdRubro:idRubro, 
            Stock:newProductStock
        };

        const newProduct = populateDefaultProduct(productValues);

        const createdProductId = await createAccountProduct({newProduct,token:tokens[account]});
        if('error' in createdProductId)
        return alert(`error al crear el producto ${newProductTitle}\nerror:${createdProductId.error}`);
    
        newProduct.Id = createdProductId.id;

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
    const finalCostRef = useRef<HTMLInputElement>(null);
    const profitRef = useRef<HTMLInputElement>(null);
    const ivaRef = useRef<HTMLInputElement>(null);
    const tagsRef = useRef<HTMLInputElement>(null);
    const exchRateRef = useRef<HTMLSelectElement>(null);
        
    return (
        <Modal>
            <div className={containerStyles.container+' flex-column flex-gap-l'}>
                <h3>Editar Item</h3>
                
                <h3>
                    <div className='flex-row flex-gap-xl'>
                    <LabelWrapper labelText='codigo'>
                    {codigo}
                    </LabelWrapper>
                    <LabelWrapper labelText='titulo'>
                     {titulo}
                    </LabelWrapper>
                    </div>
                </h3>

                <div className='flex-column flex-gap-m'>
                    {/* costo,rentabilidad,iva,tagsId,cotizacion */}
                    <div className='flex-row flex-gap-m'>

                        <LabelWrapper labelText='costo de lista'>
                            <input ref={finalCostRef} type="number" defaultValue={costo} key={codigo}/>
                        </LabelWrapper>
                        <LabelWrapper labelText='rentabilidad'>
                            <input ref={profitRef} type="number" defaultValue={rentabilidad} key={codigo}/>
                        </LabelWrapper>
                    
                        <LabelWrapper labelText='iva'>
                            <input ref={ivaRef} type="number" defaultValue={iva} key={codigo}/>
                        </LabelWrapper>
            
                    </div>

                    <div className='flex-row flex-gap-m flex-grow'>
                        <LabelWrapper labelText='tags'>
                            <input ref={tagsRef} type="text" defaultValue={Object.keys(tags).join(',')} key={codigo} placeholder='tags separados por comas' />
                        </LabelWrapper>
                        <LabelWrapper labelText='cotizacion'>
                            <select ref={exchRateRef} name="cotizacion" key={codigo} defaultValue={cotizacion}>
                                <Options optionList={cotizacionesOptionList} />
                            </select>
                        </LabelWrapper>
                        <LabelWrapper labelText='final'>
                            <input type="number" disabled={true} value={finalPrice.toFixed(2)} key={codigo} title={finalPriceDetailsTitle}/>
                        </LabelWrapper>
                    </div>

                    <div>
                        <input type="button" value="actualizar" onClick={updateListaItemHandler}/>
                    </div>
            
                </div>

                <h3>Editar Skus</h3>

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
                    <h4>Items</h4>
                    {/* <SkuEditorItemSkuLabels listaItemCodigo={codigo} listaItemCbProducts={listaItemCbProducts} removeItemSku={removeItemSku} addItemSku={undefined}/> */}
                    <ListaCbItemLabels listaItemCodigo={codigo} listaItemCbProducts={listaItemCbProducts} removeItemSku={removeItemSku} />
                </div>}

                {renderListaItemCbProductsSuggestions && <div>
                    <h4>Sugerencias</h4>
                    <ListaCbItemSuggestLabels listaItemCodigo={codigo} listaItemCbProducts={listaItemCbProductsSuggestions} addItemSku={addItemSku}/>
                </div>}
  
                <div className="flex-row flex-gap-s">
                    <input onClick={confirmHandler} type="button" value="listo" />
                    <input onClick={cancelHandler} type="button" value="cancelar" />
                </div> 
            </div>
        </Modal>
    )
}