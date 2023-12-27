'use client'

import { Modal } from "@/components/Modal"
import { ContabiliumContext } from "@/contexts/ContabiliumContext"
import { RubrosWithSubRubrosPerAccount, Tokens, Vendor } from "@/types/Contabilium"
import { Products } from "@/types/Products"
import { getProducts } from "@/utils/contabilium/getProducts"
import { getRubrosWithSubRubros } from "@/utils/contabilium/getRubrosWithSubRubros"
import { getVendors } from "@/utils/contabilium/getVendors"
import { fixProducts } from "@/utils/listas/fixProducts"
import { useEffect, useState } from "react"
import containerStyles from '@/styles/containers.module.css'
import { serializeProducts } from "@/utils/serializeProducts"

export const ContabiliumProvider = ({children,tokens}:{children:React.ReactNode,tokens:Tokens})=>{
    const [vendors,setVendors] = useState<Vendor[]>([]);
    const [fixedProducts,setFixedProducts] = useState<Products>({main:[],secondary:[]});
    const [rubrosWithSubRubrosPerAccount,setRubrosWithSubRubrosPerAccount] = useState<RubrosWithSubRubrosPerAccount>({main:[],secondary:[]});
    
    const initContabiliumProvider = async ()=>{
        const [vendors,products] = await Promise.all([getVendors({tokens}),getProducts({tokens})])
        const fixedProducts = fixProducts({products,vendors})
        const rubrosWithSubRubrosPerAccount = await getRubrosWithSubRubros({tokens});     
        setFixedProducts(fixedProducts);
        setVendors(vendors);
        setRubrosWithSubRubrosPerAccount(rubrosWithSubRubrosPerAccount);
    }

    useEffect(()=>{
        initContabiliumProvider();
    },[])

    const updateProducts = ({newProducts}:{newProducts:Products})=>{
        const serializedProducts = serializeProducts({products:fixedProducts});
        const serializedNewProducts = serializeProducts({products:newProducts});

        const newMainContextProducts = Object.values({...serializedProducts.main,...serializedNewProducts.main})
        const newSecondaryContextProducts = Object.values({...serializedProducts.secondary,...serializedNewProducts.secondary})

        setFixedProducts({main:newMainContextProducts,secondary:newSecondaryContextProducts});
    }

    if(vendors.length === 0 || fixedProducts.main.length === 0 || fixedProducts.secondary.length === 0 || rubrosWithSubRubrosPerAccount.main.length === 0 || rubrosWithSubRubrosPerAccount.secondary.length === 0)
    return (
        <Modal>
            <div className={`${containerStyles.container}`}>
                <h3>Descargando datos de contabilium...</h3>
                <p>No cierre la pagina.</p>
            </div>
        </Modal>
    )
    
    return <ContabiliumContext.Provider value={{
        rubrosWithSubRubrosPerAccount,
        tokens,
        fixedProducts,
        pullProducts:()=>{},
        updateProducts,
        vendors,
        pullVendors:()=>{},
        updateVendors:()=>{}
        }}>
        {children}
    </ContabiliumContext.Provider>
} 
