import { Product } from "@/types/Contabilium";
import { getProducts } from "@/utils/contabilium/getProducts"
 
export default async function Page() {
  const data:Product[] = await getProducts()
  
    
  console.log(data)
  return <>{}</>
}