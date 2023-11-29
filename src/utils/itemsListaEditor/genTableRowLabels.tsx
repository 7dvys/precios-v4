import { AccountType } from "@/types/Config"

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

    const precioFinalTagDetail = tagsId.length?`${fixedCoeficient>=0?'+':'-'} TAGS FIJO ${fixedCoeficient} ${porcentualCoeficientFactor>=1?'+':'-'} TAGS PORCENTUAL ${(porcentualCoeficientFactor-1)*100}`:null

    const precioFinalLabel = (
       <div className="flex-column flex-gap-s">
           <p><strong>{finalCost}</strong></p>
           <div style={{fontSize:'0.8rem',justifyContent:'end'}} className="flex-row flex-gap-s">
               <p>{cost} {precioFinalTagDetail} + {profit}% + IVA {iva}%</p>
           </div>
       </div>
    )
    return {itemLabel,detallesLabel,precioFinalLabel}
}

export const genCbItemRow = ({sheetItemCodigo,cbItemCosto,cbItemIva,cbItemStock,cbItemRentabilidad,cbItemFinal,titulo,sku,account}:{
    sheetItemCodigo:string,
    titulo:string,
    sku:string,
    account:AccountType,
    cbItemFinal:number,
    cbItemCosto:number,
    cbItemRentabilidad:number,
    cbItemIva:number,
    cbItemStock:number,
})=>{
    const itemLabel = (
        <div className="flex-column">
            <p style={{fontSize:'0.95rem',fontWeight:600}}>{titulo||'sin titulo'}</p>
            <div style={{fontSize:'0.8rem'}} className="flex-row flex-gap-m">
                <p><strong>codigo lista: </strong>{sheetItemCodigo}</p>
                <p><strong>sku: </strong>{sku}</p>
                <p><strong>cuenta: </strong>{account === 'main'?'primaria':'secundaria'}</p>
            </div>
        </div>
    )

    const detallesLabel = (
        <div style={{fontSize:'0.8rem'}} className="flex-column">
            <p><strong>stock: </strong>{cbItemStock}</p>
            {/* <p><strong>tags: </strong>{tagsId.join(',') || 'sin tags'}</p> */}
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
