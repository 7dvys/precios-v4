import { Observaciones, ObservacionesWithoutTags, Product, Vendor } from "@/types/Contabilium";
import { DecodedObject, simpleDataSerializer } from "../simpleDataSerializer";
import { Products } from "@/types/Products";
import { getSerializedVendors } from "../vendors";

const {decoder,encoder} = simpleDataSerializer();

export const fixProduct = (products:Products,vendors:Vendor[])=>{
    const serializedVendors = getSerializedVendors({vendors});
    
    const [main,secondary] = Object.values(products).map((accountProducts)=>{
        return accountProducts.reduce((acc,product)=>{
            
            const productVendorId = Number(product.CodigoBarras);
            let vendor = null;

            if(!isNaN(productVendorId) && productVendorId in serializedVendors)
            vendor = serializedVendors[productVendorId];
            else
            product.CodigoBarras = '';

            if(!product.Descripcion)
            product.Descripcion = product.Codigo;
            
            let newObservaciones:DecodedObject<ObservacionesWithoutTags> = {
                ultActualizacion:[new Date().toLocaleDateString('es-ar')],
                cotizacion:['peso'],
                cotizacionPrecio:[1],
                proveedor:[''],
                lista:[''],
                tagsId:[]
            };

            if(product.Observaciones){
                const decodedOservaciones = decoder<Observaciones>(product.Observaciones) as DecodedObject<Observaciones>;
                newObservaciones = {...newObservaciones,...decodedOservaciones};
            }
                                
            if(vendor !== null){
                const vendorName = vendor.NombreFantasia.trim() || vendor.RazonSocial.trim();
                newObservaciones.lista = [vendorName];                
                newObservaciones.proveedor = [vendorName];
            }

            product.Observaciones = encoder(newObservaciones)
            acc.push(product)
            return acc;
        },[] as Product[])
    })
    return {main,secondary};
}