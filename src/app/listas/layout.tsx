import { PageTemplate } from "@/components/PageTemplate";
import { Aside } from "../../components/Listas/Aside";

const ListasLayout = ({children}:{children:React.ReactNode})=>{
    const MainContent:React.FC = ()=>(<>{children}</>)
    return (
        <PageTemplate AsideContent={Aside} MainContent={MainContent}/>
    )
}

export default ListasLayout;
