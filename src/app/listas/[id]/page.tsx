'use client'

import { isClient } from "@/constants/isClient";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";

const Page:React.FC<{params:{id:number}}> = async ({params})=>{
    if(!isClient)
    return null;
    
    const {getListas} = await dbListasUtils()
    const listas = await getListas();
    console.log(listas[Number(params.id)])
    return <>{params.id}</>
}

export default Page;

