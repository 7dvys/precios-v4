'use client'
import navStyles from '@/styles/nav.module.css';
import { usePathname } from "next/navigation";
import { ActiveLink } from "./ActiveLink";

export const Nav:React.FC = ()=>{
    const pathname = usePathname()
    const pages = [['inicio','/'],['listas','/listas'],['opciones','/opciones']]
    const Links = pages.map(([title,href],index)=>(
        <ActiveLink key={index} href={href} pathname={pathname}>{title}</ActiveLink>
    ))
    return (<nav className={navStyles.nav}>{Links}</nav>)
}