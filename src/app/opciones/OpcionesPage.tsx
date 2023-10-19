'use client'
import { PageTemplate } from "@/components/PageTemplate"
import Aside from "./Aside";
import { Main } from "./Main";

export const OpcionesPage:React.FC = ()=>{
    return <PageTemplate MainFC={Main} AsideFC={Aside}/>
}