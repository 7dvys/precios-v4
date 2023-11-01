import { E } from "@/components/example";
import { Product } from "@/types/Contabilium";
import { getProducts } from "@/utils/contabilium/getProducts"
import { cookies } from "next/headers";
import { isDate } from "util/types";
 

export default async function Page() {
  const products = await getProducts()
  // console.log(cookies())
  // const {mainProducts,secondaryProducts}:{mainProducts:Product[],secondaryProducts:Product[]} = await getProducts()
  // return <E codigo={mainProducts[0].Codigo}/> 
  return <></>
}