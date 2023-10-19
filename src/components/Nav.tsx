'use client'
import Link from "next/link";
import navStyles from '@/styles/nav.module.css';
import buttonsStyles from '@/styles/buttons.module.css';
import { usePathname } from "next/navigation";

export const Nav:React.FC = ()=>{
    const pathName = usePathname()
    const pages = [['inicio','/'],['listas','/listas'],['opciones','/opciones']]
    const Links = pages.map(([titulo,path],index)=>(
        <Link key={index} className={`${buttonsStyles.button} ${buttonsStyles['button--hoverable']} ${pathName==path?navStyles.current:''}`} href={path}>{titulo}</Link>
    ))
    return (<nav className={navStyles.nav}>{Links}</nav>)
}