import { Observaciones, ObservacionesWithTags, ObservacionesWithoutTags, Product, Vendor } from "@/types/Contabilium";
import { DecodedObject, simpleDataSerializer } from "../simpleDataSerializer";
import { Products } from "@/types/Products";
import { getSerializedVendors } from "../vendors";
import { getItemTags } from "./getItemTags";
import { getTagsCoeficients } from "../itemsListaEditor/getTagsCoeficients";

const {decoder,encoder} = simpleDataSerializer();

export const initFixProduct = ({serializedVendors}:{serializedVendors:Record<string,Vendor>})=>({product}:{product:Product}):Product=>{    
    let codigo = product.Descripcion;

    if(codigo === null || codigo === '' || codigo === undefined)
    codigo = product.Codigo;false

    let vendorId = product.CodigoBarras;
    
    const vendorIdIsInVendors = vendorId in serializedVendors;

    if(vendorId === null || vendorId === undefined || !vendorIdIsInVendors)
    vendorId = '';

    let vendor = null;
    if(vendorIdIsInVendors)
    vendor = serializedVendors[vendorId].NombreFantasia.trim() || serializedVendors[vendorId].RazonSocial.trim();
    
    let newObservaciones:DecodedObject<ObservacionesWithoutTags> = {
        // ultActualizacion:[new Date().toLocaleDateString('es-ar')],
        ultActualizacion:[''],
        cotizacion:['peso'],
        cotizacionPrecio:[1],
        costoCotizacion:[product.CostoInterno],
        costoLista:[product.CostoInterno],
        proveedor:[''],
        lista:[''],
        tagsId:[],
        enlazadoMl:['sin revisar'],
    };

    if(vendor !== null){
        newObservaciones.lista = [vendor];                
        newObservaciones.proveedor = [vendor];
    }

    const fixedProduct = {
        ...product,
        Observaciones:encoder(newObservaciones),
        CodigoBarras:vendorId,
        Descripcion:codigo
    };

    if(product.Observaciones === null || product.Observaciones === undefined || product.Observaciones === '')
    return fixedProduct;
    
    const decodedObservaciones = decoder<Observaciones>(product.Observaciones) as DecodedObject<Observaciones>;
    
    if('cotizacionPrecio' in decodedObservaciones && decodedObservaciones.cotizacionPrecio[0] !== null && decodedObservaciones.cotizacionPrecio[0] !== undefined && decodedObservaciones.cotizacionPrecio[0] !== 0)
    newObservaciones.costoCotizacion = [Number((product.CostoInterno/decodedObservaciones.cotizacionPrecio[0]).toFixed(2))];


    if(('tagsId' in decodedObservaciones) && decodedObservaciones.tagsId.length !== 0)
    {
        const itemTags = getItemTags({decodedObservaciones:decodedObservaciones as DecodedObject<ObservacionesWithTags>});
        const {fixedCoeficient,porcentualCoeficientFactor} = getTagsCoeficients({tags:itemTags,itemTagsId:decodedObservaciones.tagsId});
        
        const costoLista = (product.CostoInterno-fixedCoeficient)/porcentualCoeficientFactor
        newObservaciones.costoLista = [costoLista];
    }
    
    newObservaciones = {...newObservaciones,...decodedObservaciones};
    fixedProduct.Observaciones = encoder(newObservaciones);
    return fixedProduct;
}

export const fixProducts = ({products,vendors}:{products:Products,vendors:Vendor[]}):Products=>{
    const serializedVendors = getSerializedVendors({vendors});
    const fixProduct = initFixProduct({serializedVendors});
    
    const [main,secondary] = Object.values(products).map((accountProducts)=>{
        return accountProducts.reduce((acc,product)=>{
            const fixedProduct = fixProduct({product})
            acc.push(fixedProduct)
            return acc;
        },[] as Product[])
    })
    return {main,secondary};
}