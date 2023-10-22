'use client'
import navStyles from '@/styles/nav.module.css';
import { usePathname } from "next/navigation";
import { ActiveLink } from "./ActiveLink";

export const Nav:React.FC = ()=>{
    const pathname = usePathname()
    const mainPathname = '/'+pathname.split('/')[1]
    const pages = [['inicio','/'],['listas','/listas'],['opciones','/opciones']]
    const Links = pages.map(([title,href],index)=>(
        <ActiveLink key={index} href={href} pathname={pathname} mainPathname={mainPathname}>{title}</ActiveLink>
    ))
    return (<nav className={navStyles.nav}>{Links}</nav>)
}