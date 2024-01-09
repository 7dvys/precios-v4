import { updateAccountProduct } from "@/services/contabilium/accountProducts";
import { AccountType } from "@/types/Config";
import { ObservacionesWithoutTags, Product, Tokens } from "@/types/Contabilium";
import { Products, SerializedProducts } from "@/types/Products";
import { DecodedObject, simpleDataSerializer } from "@/utils/simpleDataSerializer";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Modal } from "../Modal";
import ContainerStyles from '@/styles/containers.module.css'
import { LoadingRing } from "../LoadingRing";


export const RemoveObservationModal:React.FC<{
    removeObservationQueue:{sku:string,account:AccountType}[];
    setRemoveObservationQueue:Dispatch<SetStateAction<{sku:string,account:AccountType}[]>>;
    tokens:Tokens;
    serializedProducts:SerializedProducts;
    updateContextProducts:({newProducts}:{newProducts:Products})=>void;

}> = ({removeObservationQueue,setRemoveObservationQueue,serializedProducts,tokens,updateContextProducts})=>{
    const currentRemoveObservationItem = removeObservationQueue[0];

    const removeListaFromCbProductObservation = async ({account,sku}:{account:AccountType,sku:string})=>{
        const {decoder,encoder} = simpleDataSerializer()
        const currentProduct = serializedProducts[account][sku];
        const currentDecodedDescription = decoder<ObservacionesWithoutTags>(currentProduct.Observaciones) as DecodedObject<ObservacionesWithoutTags>
        const newDecodedDescription = {...currentDecodedDescription,lista:'sin proveedor',proveedor:''};
        const newProduct:Product = {...currentProduct,Observaciones:encoder(newDecodedDescription)};
        await updateAccountProduct({product:newProduct,token:tokens[account]});
        updateContextProducts({newProducts:{main:[],secondary:[],[account]:[newProduct]}})
        setRemoveObservationQueue(current=>{
            const [_,...newRemoveObservationQueue] = current;
            return newRemoveObservationQueue;
        })
    }
    
    useEffect(()=>{
        removeListaFromCbProductObservation({...currentRemoveObservationItem});
    },[currentRemoveObservationItem])

    return (
        <Modal>
            <div className={`${ContainerStyles.container}`}>
                <div className="flex-column flex-align-center flex-gap-m">
                    <h3>Eliminando <strong>sku:{currentRemoveObservationItem.sku}</strong> de la cuenta <strong>{currentRemoveObservationItem.account}</strong></h3>
                    <LoadingRing/>
                    <p>no cierre esta ventana</p>
                </div>
            </div>
        </Modal>
    )
}