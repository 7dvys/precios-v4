import { Suspense } from "react";
import { PageTemplate } from "@/components/PageTemplate";
import { Aside } from "../../components/Listas/Aside";
import Loading from "./loading";


export default ({children}:{children:React.ReactNode})=>{

    const MainContent:React.FC = ()=>(<>{children}</>)

    return (
        <Suspense fallback={<Loading/>}>
            <PageTemplate AsideContent={Aside} MainContent={MainContent}/>
        </Suspense>
    )
}
