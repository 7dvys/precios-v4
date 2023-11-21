import { Suspense } from "react";
import { PageTemplate } from "@/components/PageTemplate";
import { Aside } from "../../components/Listas/Aside";
import Loading from "./loading";


const Layout = ({children}:{children:React.ReactNode})=>{

    const MainContent:React.FC = ()=>(<>{children}</>)

    return (
        <Suspense fallback={<Loading/>}>
            <PageTemplate AsideContent={Aside} MainContent={MainContent}/>
        </Suspense>
    )
}

export default Layout;