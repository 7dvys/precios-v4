import { Product, RubroWithSubRubros, RubrosWithSubRubrosPerAccount, SubRubro } from "@/types/Contabilium";
import { decodeObservaciones } from "./decodeObservaciones";
import { AccountType } from "@/types/Config";

export const genProductItemRow = ({product,vendor,cotizacion,tags,rubroName,subRubroName}:{rubroName:string,subRubroName:string,product:Product & {account:AccountType},vendor:string,tags:string[],cotizacion:string,})=>{
    const {
        Descripcion:codigo,
        Nombre:titulo,
        Codigo:sku,
        account,
        Stock:stock,
        PrecioFinal:final,
        CostoInterno:costo,
        Rentabilidad:rentabilidad,
        Iva:iva,
        Estado:estado,
        Tipo:tipo,
    } = product

    const itemLabel = (
        <div className="flex-column">
            <p style={{fontSize:'0.95rem',fontWeight:600}}>{titulo||'sin titulo'}</p>
            <div style={{fontSize:'0.8rem'}} className="flex-row flex-gap-m">
                <p><strong>codigo lista: </strong>{codigo}</p>
                <p><strong>sku: </strong>{sku}</p>
                <p><strong>cuenta: </strong>{account === 'main'?'primaria':'secundaria'}</p>
                {vendor!== null && <p><strong>proveedor: </strong>{vendor}</p>}
                <p><strong>rubro: </strong>{rubroName}</p>
                <p><strong>subRubro: </strong>{subRubroName}</p>
                <p><strong>estado: </strong>{estado}</p>
                <p><strong>tipo: </strong>{tipo}</p>
                <p><strong>stock: </strong>{stock}</p>
            </div>
        </div>
    )

    const detallesLabel = (
        <div style={{fontSize:'0.8rem'}} className="flex-column">
            <p><strong>cotizacion: </strong>{cotizacion !== null?cotizacion:'peso'}</p>
            <p><strong>tags: </strong>{(tags !== null && tags.length>0)?tags.join(','):'sin tags'}</p>
        </div>
    )

    const precioFinalLabel = (
        <div className="flex-column flex-gap-s">
            <p>final <strong>{final}</strong></p>
            <div style={{fontSize:'0.8rem',justifyContent:'end'}} className="flex-row flex-gap-s">
                <p>{costo.toFixed(2)} + {rentabilidad}% + IVA {iva}%</p>
            </div>
        </div>
    )

    return {itemLabel,detallesLabel,precioFinalLabel}
}