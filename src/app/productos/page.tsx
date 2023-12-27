'use client'

import { ContabiliumContext } from "@/contexts/ContabiliumContext"
import { useContext } from "react"

const ProductosPage:React.FC = ()=>{
    const {tokens} = useContext(ContabiliumContext);

    return <>main {tokens.main}</>
}

export default ProductosPage;