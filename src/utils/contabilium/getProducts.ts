import { Products } from "@/types";
import { cookies } from "next/headers";

export const getProducts = async ()=>{
    let products:Products = {main:[],secondary:[]};
    const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`
    const config:RequestInit = {
        method:'GET',
        credentials:'include',
        headers:{
            Cookie:cookies().toString()
        }
    }
    const productsResponse = await fetch(baseUrl+'/api/contabilium/products',config )
    if(productsResponse.ok)
    products = await productsResponse.json();

    return products;
}   