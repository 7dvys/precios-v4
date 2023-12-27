'use client'

import { TableColumn, TableItem } from "@/types/TableTypes"
import { Table } from "../Table/Table"
import { Products } from "@/types/Products"
import { AccountType } from "@/types/Config"
import { Product, RubroWithSubRubros, RubrosWithSubRubrosPerAccount, SubRubro } from "@/types/Contabilium"
import { genProductItemRow } from "@/utils/genProductItemRow"
import { decodeObservaciones } from "@/utils/decodeObservaciones"

export const ProductosPage:React.FC<{fixedProducts:Products,rubrosWithSubRubrosPerAccount:RubrosWithSubRubrosPerAccount}> = ({fixedProducts,rubrosWithSubRubrosPerAccount})=>{
    
    const unifiedProducts = (Object.entries(fixedProducts) as [AccountType,Product[]][]).flatMap(([account,accountProducts])=>
        accountProducts.map(product=>({...product,account,id:product.Id}))
    )
    
    
    const columns:TableColumn[] = [
        {keyColumn:'sku',label:'sku',searchable:true,filterable:false,visible:false},
        {keyColumn:'codigo',label:'codigo de lista',searchable:true,filterable:false,visible:false},
        {keyColumn:'titulo',label:'titulo',searchable:true,filterable:false,visible:false},
        {keyColumn:'cotizacion',label:'cotizacion',searchable:false,filterable:true,visible:false},
        {keyColumn:'tagsId',label:'tags',searchable:false,filterable:true,visible:false},
        {keyColumn:'rubro',label:'rubro',searchable:false,filterable:true,visible:false},
        {keyColumn:'subRubro',label:'subRubro',searchable:false,filterable:true,visible:false},
        {keyColumn:'account',label:'cuenta',searchable:false,filterable:true,visible:false},
        {keyColumn:'stock',label:'stock',searchable:false,filterable:true,visible:false},
        {keyColumn:'tipo',label:'tipo',searchable:false,filterable:true,visible:false},
        {keyColumn:'estado',label:'estado',searchable:false,filterable:true,visible:false},
        {keyColumn:'vendor',label:'proveedor',searchable:false,filterable:true,visible:false},

        {keyColumn:'item',label:'item',searchable:false,filterable:false},
        {keyColumn:'detalles',label:'detalles',searchable:false,filterable:false},
        {keyColumn:'precioFinal',label:'precio final',searchable:false,filterable:false},
    ]

    const items:TableItem[] = unifiedProducts.map(product=>{
        const {
            Id:id,
            Codigo:sku,    
            Descripcion:codigo,
            Nombre:titulo,
            account,
            IdRubro,
            IdSubrubro,
            Stock:stock,
            Tipo:tipo,
            Estado:estado,


        } = product;
        const observaciones = decodeObservaciones(product.Observaciones) 
        const vendor = observaciones !== null? observaciones.proveedor[0]:'sin proveedor';   
        const tags = observaciones !== null? observaciones.tagsId:[];   
        const cotizacion = observaciones !== null?observaciones.cotizacion[0]:'peso';

        const rubro = rubrosWithSubRubrosPerAccount[account].find(({Id,})=>Id.toString()===IdRubro) as RubroWithSubRubros
        const rubroName = '' ;
        const subRubro = rubro.SubRubros.find(({Id})=>Id.toString()===IdSubrubro) as SubRubro;
        const subRubroName = '' 
        
        const {itemLabel,precioFinalLabel,detallesLabel} = genProductItemRow({product,rubroName,subRubroName,vendor,tags,cotizacion})


        return {
            id,
            sku,
            vendor,
            codigo,
            titulo,
            cotizacion,
            tagsId:tags,
            rubro:rubroName,
            subRubro:subRubroName,
            account,
            stock,
            tipo,
            estado,
            item:itemLabel,
            detalles:detallesLabel,
            precioFinal:precioFinalLabel
        }
    })
    return (
        <div className="flex-column flex-gap-m" style={{width:'100%'}}>
            <Table columns={columns} items={items} />
        </div>
    )
}