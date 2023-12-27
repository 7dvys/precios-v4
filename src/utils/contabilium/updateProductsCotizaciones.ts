import { AccountType } from "@/types/Config";
import { ObservacionesWithTags, ObservacionesWithoutTags, Product, Tokens } from "@/types/Contabilium";
import { Products } from "@/types/Products";
import { DecodedObject, simpleDataSerializer } from "../simpleDataSerializer";
import { getItemTags } from "../listas/getItemTags";
import { genFinalCostPriceAndFinalPrice } from "../itemsListaEditor/genFinalCostPriceAndFinalPrice";
import { updateProducts } from "./updateProducts";

export const updateProductsCotizaciones = ({fixedProducts,cotizacionTitle,cotizacionValue,tokens}:{tokens:Tokens,cotizacionTitle:string,cotizacionValue:number,fixedProducts:Products})=>{
    
    const productsWithNewExchRate = (Object.entries(fixedProducts) as [AccountType,Product[]][]).map(([account,accountProducts])=>{
        return accountProducts.filter(({Observaciones,Tipo})=>{
            const {decoder} = simpleDataSerializer()
            const decodedObservaciones = decoder<ObservacionesWithTags>(Observaciones) as DecodedObject<ObservacionesWithTags>;
            if(Tipo === 'C' || !('cotizacion' in decodedObservaciones) || !('cotizacionPrecio' in decodedObservaciones) || !('costoCotizacion' in decodedObservaciones) || !('costoLista' in decodedObservaciones) || !('tagsId' in decodedObservaciones))
            return false;
        
            const {cotizacion:[cotizacion]} = decodedObservaciones;
            return cotizacion === cotizacionTitle
        })
    });

    const [main,secondary] = (Object.entries(productsWithNewExchRate) as [AccountType,Product[]][]).map(([account,accountProducts])=>{
        return accountProducts.map(product=>{
            const {Observaciones,Rentabilidad:rentabilidad,Iva:iva} = product;
            
            const {decoder,encoder} = simpleDataSerializer()
            const decodedObservaciones = decoder<ObservacionesWithTags>(Observaciones) as DecodedObject<ObservacionesWithTags>;
           
            const {tagsId,costoCotizacion:[costoCotizacion]} = decodedObservaciones;

            const newCostoLista = cotizacionValue*costoCotizacion;
            
            const tags = getItemTags({decodedObservaciones});
            const {price,finalPrice,finalCost} = genFinalCostPriceAndFinalPrice({tags,tagsId,costo:newCostoLista,rentabilidad,iva})

            const newObservaciones:DecodedObject<ObservacionesWithoutTags> = {
                ...decodedObservaciones,
                ultActualizacion:[new Date().toLocaleDateString('es-ar')],
                costoLista:[Number(newCostoLista.toFixed(2))],
                cotizacionPrecio:[cotizacionValue]
            };

            const newProduct:Product = {...product,CostoInterno:Number(finalCost.toFixed(2)),Precio:Number(price.toFixed(2)),PrecioFinal:Number(finalPrice.toFixed(2)),Observaciones:encoder(newObservaciones)}
            return newProduct;
        });
    });

    const newProducts:Products = {main,secondary};

    return updateProducts(tokens,newProducts,'both');
}