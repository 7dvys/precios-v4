'use client'
import { ActiveLink } from "@/components/ActiveLink";
import containerStyles from '@/styles/containers.module.css'
import { usePathname } from "next/navigation";

export const Aside:React.FC = ()=>{
    const pathname = usePathname();
    return (
        <div className={containerStyles.container}>
            <h3>Listas</h3>
            <ul>
                <li><ActiveLink href={'/listas'} pathname={pathname}>Ver listas</ActiveLink></li>
                <li><ActiveLink href={'/listas/agregar'} pathname={pathname}>Nueva lista</ActiveLink></li>
            </ul>
        </div>
    )
}