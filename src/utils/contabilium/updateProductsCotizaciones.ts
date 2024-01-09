import { AccountType } from "@/types/Config";
import { ObservacionesWithTags, ObservacionesWithoutTags, Product, Tokens } from "@/types/Contabilium";
import { Products } from "@/types/Products";
import { DecodedObject, simpleDataSerializer } from "../simpleDataSerializer";
import { getItemTags } from "../listas/getItemTags";
import { genFinalCostPriceAndFinalPrice } from "../itemsListaEditor/genFinalCostPriceAndFinalPrice";
import { updateProducts } from "./updateProducts";
import { UpdatedProductStatus } from "@/components/UpdateProductsModal";

export const updateProductsCotizaciones = async ({fixedProducts,onUpdateCotizacionesQueue,tokens}:{
    tokens:Tokens,
    onUpdateCotizacionesQueue: {
        title: string;
        value: number;
    }[],
    fixedProducts:Products
})=>{
    const updateProductsPromises = onUpdateCotizacionesQueue.map(({title,value})=>{
        return updateProductsCotizacion({fixedProducts,cotizacionTitle:title,cotizacionValue:value,tokens})
    })

    const updateProductsStatusList = await Promise.all(updateProductsPromises)
    
    const updateProductsStatus = updateProductsStatusList.reduce((acc,currentUpdateProductsStatus)=>{
        return {main:{...acc.main,...currentUpdateProductsStatus.main},secondary:{...acc.secondary,...currentUpdateProductsStatus.secondary}};
    },{main:[],secondary:[]} as UpdatedProductStatus);

    return updateProductsStatus;
}

const updateProductsCotizacion = ({fixedProducts,cotizacionTitle,tokens,cotizacionValue}:{
    fixedProducts:Products,
    cotizacionTitle:string,
    cotizacionValue:number,
    tokens:Tokens,
})=>{

    const productsWithNewExchRate = (Object.entries(fixedProducts) as [AccountType,Product[]][]).map(([account,accountProducts])=>{
        return accountProducts.filter(({Observaciones,Tipo})=>{
            const {decoder} = simpleDataSerializer()
            const decodedObservaciones = decoder<ObservacionesWithTags>(Observaciones) as DecodedObject<ObservacionesWithTags>;
            if(Tipo === 'C' || !('cotizacion' in decodedObservaciones) || !('cotizacionPrecio' in decodedObservaciones) || !('costoCotizacion' in decodedObservaciones) || !('costoLista' in decodedObservaciones) || !('tagsId' in decodedObservaciones))
            return false;
        
            const {cotizacion:[cotizacion],cotizacionPrecio:[precio]} = decodedObservaciones;
            return cotizacion === cotizacionTitle && Number(precio) !== cotizacionValue
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
                cotizacionPrecio:[Number(cotizacionValue)]
            };

            const newProduct:Product = {...product,CostoInterno:Number(finalCost.toFixed(2)),Precio:Number(price.toFixed(2)),PrecioFinal:Number(finalPrice.toFixed(2)),Observaciones:encoder(newObservaciones)}
            return newProduct;
        });
    });

    const newProducts:Products = {main,secondary};

    return updateProducts(tokens,newProducts,'both');
}