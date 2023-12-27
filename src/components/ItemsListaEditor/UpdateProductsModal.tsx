import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Modal } from "../Modal";
import { LoadingRing } from "../LoadingRing";
import ContainerStyles from '@/styles/containers.module.css'
import { Products } from "@/types/Products";
import { AccountType } from "@/types/Config";
import { Product } from "@/types/Contabilium";

export type UpdatedProductStatus = {
    main: {
        [key: number]: Product|false;
    };
    secondary: {
        [key: number]: Product|false;
    };
}

export const UpdateProductsModal:React.FC<{
    setOnUpdate:Dispatch<SetStateAction<boolean>>,
    initUpdateProducts:()=>false|Promise<UpdatedProductStatus>;
    updateContextProducts: ({ newProducts }: {
        newProducts: Products;
    }) => void
}> = ({setOnUpdate,initUpdateProducts,updateContextProducts})=>{

    const [updateProductsStatus,setUpdateProductsStatus] = useState<UpdatedProductStatus|undefined>(undefined);

    const updateProducts = async ()=>{
        const updateProductsStatus = await initUpdateProducts()

        if(updateProductsStatus === false)
        return setOnUpdate(false);
    
        setUpdateProductsStatus(updateProductsStatus);

        const updatedProductsOk = (Object.entries(updateProductsStatus) as [AccountType,Record<number,Product|false>][]).reduce((acc,[account,accountUpdatedProductStatus])=>{
            Object.values(accountUpdatedProductStatus).forEach((state)=>{
                if(state !== false)
                acc[account].push(state);
            })
            
            return acc;
        },{main:[],secondary:[]} as Products)

        if(updatedProductsOk.main.length !== 0 || updatedProductsOk.secondary.length !== 0)
        updateContextProducts({newProducts:updatedProductsOk})
    }
    
    useEffect(()=>{
        updateProducts();
    },[])

    if(updateProductsStatus === undefined)
    return (
        <Modal>
            <div className={`${ContainerStyles.container}`}>
                <div className="flex-column flex-align-center flex-gap-m">
                    <h3>Actualizando productos</h3>
                    <LoadingRing/>
                    <p>no cierre esta ventana</p>
                </div>
            </div>
        </Modal>
    )

    // const [mainOk,mainErr] = updateProductsStatus.main

    return (
        <Modal>
                 <div className={`${ContainerStyles.container}`}>
                <div className="flex-column flex-gap-m">
                    <h3>Productos actualizados.</h3>
                    <p>Se han actualizado:
                    <br/>Principal:{Object.values(updateProductsStatus.main).length}
                    <br />Secundaria:{Object.values(updateProductsStatus.secondary).length}
                    </p>
                <button onClick={()=>{setOnUpdate(false)}}>listo</button>
                </div>
            </div>
        </Modal>
    )
}