import { AccountType } from "@/types/Config"
import { decodeObservaciones } from "../decodeObservaciones"

export const genSheetItemRow = ({fixedCoeficient,porcentualCoeficientFactor,profit,iva,cost,finalCost,cotizacion,tagsId,titulo,sheetItemCodigo,accountTypeFromSkus}:{
    titulo:string|null,
    sheetItemCodigo:string,
    accountTypeFromSkus: "sin items" | "primaria" | "secundaria" | "ambas",
    cotizacion:string,
    tagsId:string[],
    finalCost:number,
    cost:number,
    profit:number,
    iva:number,
    fixedCoeficient:number,
    porcentualCoeficientFactor:number,
})=>{

    const itemLabel = (
        <div className="flex-column">
            <p style={{fontSize:'0.95rem',fontWeight:600}}>{titulo||'sin titulo'}</p>
            <div style={{fontSize:'0.8rem'}} className="flex-row flex-gap-m">
                <p><strong>codigo: </strong>{sheetItemCodigo}</p>
                <p>{accountTypeFromSkus === 'sin items'?accountTypeFromSkus:'items en '+accountTypeFromSkus}</p>
            </div>
        </div>
    )

    const detallesLabel = (
       <div style={{fontSize:'0.8rem'}} className="flex-column">
           <p><strong>cotizacion: </strong>{cotizacion}</p>
           <p><strong>tags: </strong>{tagsId.join(',') || 'sin tags'}</p>
       </div>
    )

    const precioFinalTagDetail = tagsId.length?`${fixedCoeficient>=0?'+':'-'} TAGS FIJO ${fixedCoeficient} ${porcentualCoeficientFactor>=1?'+':'-'} TAGS PORCENTUAL ${((porcentualCoeficientFactor-1)*100).toFixed(2)}%`:null

    const precioFinalLabel = (
       <div className="flex-column flex-gap-s">
           <p><strong>{finalCost.toFixed(2)}</strong></p>
           <div style={{fontSize:'0.8rem',justifyContent:'end'}} className="flex-row flex-gap-s">
               <p>{cost} {precioFinalTagDetail} + {profit}% + IVA {iva}%</p>
           </div>
       </div>
    )
    return {itemLabel,detallesLabel,precioFinalLabel}
}

export const genCbItemRow = ({sheetItemCodigo,rubro,cbItemCosto,cbItemIva,subRubro,cbItemStock,cbItemRentabilidad,cbItemFinal,cbItemObservaciones,titulo,sku,account}:{
    sheetItemCodigo:string,
    titulo:string,
    sku:string,
    account:AccountType,
    cbItemFinal:number,
    cbItemCosto:number,
    cbItemRentabilidad:number,
    cbItemIva:number,
    cbItemStock:number,
    cbItemObservaciones:string,
    rubro:string,
    subRubro:string,
})=>{
    const observaciones = decodeObservaciones(cbItemObservaciones) 
    const currentVendor = observaciones !== null? observaciones.proveedor[0]:null;   
    const currentTags = observaciones !== null? observaciones.tagsId:null;   
    const currentCotizacion = observaciones !== null?observaciones.cotizacion[0]:null;
    
    const itemLabel = (
        <div className="flex-column">
            <p style={{fontSize:'0.95rem',fontWeight:600}}>{titulo||'sin titulo'}</p>
            <div style={{fontSize:'0.8rem'}} className="flex-row flex-gap-m">
                <p><strong>codigo lista: </strong>{sheetItemCodigo}</p>
                <p><strong>sku: </strong>{sku}</p>
                <p><strong>cuenta: </strong>{account === 'main'?'primaria':'secundaria'}</p>
                {currentVendor!== null && <p><strong>proveedor: </strong>{currentVendor}</p>}
                <p><strong>rubro: </strong>{rubro}</p>
                <p><strong>subRubro: </strong>{subRubro}</p>
                <p><strong>stock: </strong>{cbItemStock}</p>
            </div>
        </div>
    )

    const detallesLabel = (
        <div style={{fontSize:'0.8rem'}} className="flex-column">
            <p><strong>cotizacion: </strong>{currentCotizacion !== null?currentCotizacion:'peso'}</p>
            <p><strong>tags: </strong>{(currentTags !== null && currentTags.length>0)?currentTags.join(','):'sin tags'}</p>
        </div>
    )

    const precioFinalLabel = (
        <div className="flex-column flex-gap-s">
            <p>final actual <strong>{cbItemFinal}</strong></p>
            <div style={{fontSize:'0.8rem',justifyContent:'end'}} className="flex-row flex-gap-s">
                <p>{cbItemCosto.toFixed(2)} + {cbItemRentabilidad}% + IVA {cbItemIva}%</p>
            </div>
        </div>
    )

    return {itemLabel,detallesLabel,precioFinalLabel}
}
