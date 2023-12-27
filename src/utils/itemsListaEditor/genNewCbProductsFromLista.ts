import { Lista, Tag, Tags } from "@/types/Listas";
import { Products } from "@/types/Products";
import { serializeProducts } from "../serializeProducts";
import { ObservacionesWithTags, ObservacionesWithoutTags, Product } from "@/types/Contabilium";
import { getTagsCoeficients } from "./getTagsCoeficients";
import { populateDefaultProduct } from "../contabilium/populateDefaultProduct";
import { AccountType } from "@/types/Config";
import { DecodedObject, simpleDataSerializer } from "../simpleDataSerializer";
import { Cotizaciones } from "@/types/Cotizaciones";

export const genNewCbProductsFromLista = ({lista,products,cotizaciones}:{lista:Lista,products:Products,cotizaciones:Cotizaciones})=>{
    const {items,vendor,vendorId,tags,name} = lista;
    
    if(items.length === 0)
    return;

    const {encoder} = simpleDataSerializer()

    const serializedProducts = serializeProducts({products});
    
    const newProducts:Products = items.reduce((acc,listaItem)=>{
        const {codigo,costo,iva,rentabilidad,cbItemSkus,tagsId,cotizacion,} = listaItem;
        
        const {fixedCoeficient,porcentualCoeficientFactor} = getTagsCoeficients({tags,itemTagsId:tagsId})
        const rentabilidadFactor = (rentabilidad/100)+1 || 1;
        const ivaFactor = (iva/100)+1 || 1;
        const finalCost = (costo+fixedCoeficient)*porcentualCoeficientFactor;
        const price = finalCost*rentabilidadFactor;
        const finalPrice = price*ivaFactor;
        const cotizacionPrecio = cotizaciones[cotizacion]
        const costoCotizacion = costo/cotizacionPrecio;

        const newObservaciones:DecodedObject<ObservacionesWithoutTags> = {
            ultActualizacion:[new Date().toLocaleDateString('es-ar')],
            cotizacion:[cotizacion],
            cotizacionPrecio:[cotizacionPrecio],
            costoCotizacion:[costoCotizacion],
            costoLista:[costo],
            proveedor:[vendor],
            lista:[name],
            tagsId:tagsId,
            enlazadoMl:['sin revisar'],
        };

        if(tagsId.length>0)
        {
            tagsId.forEach(tagId=>{
                const tag = tags[tagId] as Tag;
                (newObservaciones as DecodedObject<ObservacionesWithTags>)[tagId] = [tag.porcentual,tag.fijo]
            })
        }
        
        (Object.entries(cbItemSkus) as [AccountType,string[]][]).forEach(([account,accountCbItemSkus])=>{
            accountCbItemSkus.forEach(sku=>{
                const currentProduct = serializedProducts[account][sku];

                const newProductValues = {
                    Nombre:currentProduct.Nombre.trim(),
                    
                    Codigo:sku,
                    Descripcion:codigo,
                    CodigoBarras:vendorId.toString(),
                    Observaciones:encoder(newObservaciones),

                    Iva:iva,
                    Rentabilidad:rentabilidad, 

                    CostoInterno:Number(finalCost.toFixed(2)),
                    Precio:Number(price.toFixed(2)),
                    PrecioFinal:Number(finalPrice.toFixed(2)),
                }; 

                const newProduct = {...currentProduct,...newProductValues};
                acc[account].push(newProduct);
            })
        })

        return acc;
    },{main:[],secondary:[]} as Products) 

    return newProducts;
}