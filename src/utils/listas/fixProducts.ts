import { Products } from "@/types";
import { Observaciones, ObservacionesWithoutTags, Product, Vendor } from "@/types/Contabilium";
import { simpleDataSerializer } from "../simpleDataSerializer";

const {decoder,encoder} = simpleDataSerializer();

export const fixProduct = (products:Products,vendors:Vendor[])=>{
    
    const [main,secondary] = Object.values(products).map((accountProducts)=>{
        return accountProducts.reduce((acc,product)=>{
            // no importa que no tenga observaciones.
            const productVendorId = Number(product.CodigoBarras);
            const vendor = vendors.find(({Id})=>productVendorId===Id);

            if(!vendor)
            return acc;

            const vendorName = vendor.NombreFantasia.trim() || vendor.RazonSocial.trim();

            const decodedOservaciones = decoder<Observaciones>(product.Observaciones) as ObservacionesWithoutTags;
            
            const listaKeys = {
                lista: vendorName,
                tagsId: [],
            }

            if('lista' in decodedOservaciones && 'tagsId' in decodedOservaciones)
            return acc;

            const newObservaciones:ObservacionesWithoutTags = {...(decodedOservaciones as ObservacionesWithoutTags),...listaKeys}

            if(!('cotizacion' in decodedOservaciones)){
                newObservaciones.cotizacion = 'peso';
                newObservaciones.cotizacionPrecio = 1;
            }

            if(!('proveedor' in decodedOservaciones))
            newObservaciones.proveedor = vendorName;

            product.Observaciones = encoder(newObservaciones)
            acc.push(product)
            return acc;
        },[] as Product[])
    })
    return {main,secondary};
}