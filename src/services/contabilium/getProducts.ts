import { Product } from "@/types/Contabilium";

// Debemos 
const getProducts = async ({token}:{token:string})=>{
    const location = 'https://rest.contabilium.com/api/conceptos/search?pageSize=50&page=';

    const config = {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        next:{revalidate:3600}
    }

    let page = 0;
    const response = await fetch(location+`${++page}`,config as ResponseInit);
    
    const {Items,TotalItems} = await response.json();

    let remainingPages = Math.trunc((TotalItems-50)/50)
    
    if((TotalItems-50)%50) 
    remainingPages++;
    
    const promises = [];
    for(let times=0;times<remainingPages;times++){
    const promise = fetch(location+`${++page}`,config as ResponseInit);
        promises.push(promise)
    }

    const jsonPromises:Promise<{Items:Product[]}>[] = [];
    await Promise.all(promises).then((productResponses)=>{
        productResponses.forEach((response)=>{
            if(response.ok) 
            jsonPromises.push(response.json())            
        })
    })

    const allProducts:Product[] = [];
    await Promise.all(jsonPromises).then((products)=>{
        products.forEach(({Items})=>{
            allProducts.push(...Items);
        })
    })
    
    allProducts.push(...Items);
    return allProducts;
}

export {getProducts};