'use client'
import { ActiveLink } from "@/components/ActiveLink";
import { PageTemplate } from "@/components/PageTemplate";
import containerStyles from '@/styles/containers.module.css'
import { usePathname,useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({children}:{children:React.ReactNode})=>{
    const pathname = usePathname();
    const router = useRouter();

    const MainContent:React.FC = ()=>(<>{children}</>)
    const Aside:React.FC = ()=>{
        return (
            <div className={containerStyles.container}>
                <h3>Opciones</h3>
                <ul>
                    <li><ActiveLink href={'/opciones/contabilium'} pathname={pathname}>contabilium</ActiveLink></li>
                    <li><ActiveLink href={'/opciones/cotizaciones'} pathname={pathname}>cotizaciones</ActiveLink></li>
                </ul>
            </div>
        )
    }

    useEffect(() => {
      if (pathname === '/opciones') {
        router.push('/opciones/contabilium');
      }
    });

    return <PageTemplate AsideContent={Aside} MainContent={MainContent}/>
}

export default Layout;