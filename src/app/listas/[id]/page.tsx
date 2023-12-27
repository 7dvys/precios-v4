import { ListaPage } from "@/components/Lista/ListaPage";

const Page:React.FC<{params:{id:number}}> = async ({params})=><ListaPage listaId={params.id}/>

export default Page;

