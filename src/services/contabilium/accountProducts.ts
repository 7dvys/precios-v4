import { Product } from "@/types/Contabilium";
import { revalidateTag } from "next/cache";

type GetProductsDeps = {config:RequestInit,page:number,remainingPages:number,location:string};

const getProductsByBatch = async ({page,remainingPages,config,location}:GetProductsDeps)=>{
    const reqProducts = [];
    for(;page<=remainingPages;){
        reqProducts.push(fetch(location+`${++page}`,config));
    }
    const responses = await Promise.all(reqProducts);
    return responses;
}

const getProductsByBlocks = async ({page,remainingPages,config,location}:GetProductsDeps)=>{
    const responses = [];
    for(;page<=remainingPages;){
        const blockPromises = [];
        for(let i=0;i<2||page<=remainingPages;i++){
            blockPromises.push(fetch(location+`${++page}`,config));
        } 
        const blockResponses = await Promise.all(blockPromises);
        responses.push(...blockResponses);
        // console.log(`${times} of ${remainingPages}`);
    }
    return responses;
}

const getProductsByOne = async ({page,remainingPages,config,location}:GetProductsDeps)=>{
    const responses = [];
        for(;page<=remainingPages;){
            const response = await fetch(location+`${++page}`,config as RequestInit)
            responses.push(response)
        }
    return responses;
}

export const getAccountProducts = async ({token}:{token:string})=>{
    try{
        const location = 'https://rest.contabilium.com/api/conceptos/search?pageSize=50&page=';
        const config:RequestInit = {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token,
            },
            next:{
                revalidate:3600,
                tags:['accountProducts']
            }
        }

        let page = 0;
        const response = await fetch(location+`${++page}`,config as RequestInit);

        if(!response.ok){
            // revalidateTag('accountProducts')
            return [];
        }

        const {Items,TotalItems} = await response.json();
        let remainingPages = Math.trunc((TotalItems-50)/50)
        
        if((TotalItems-50)%50) 
        remainingPages++;
        
        const getProductsDeps = {config,page,remainingPages,location};
        const responses:Response[] = [];
        try{
            const responsesBatch = await getProductsByBatch(getProductsDeps);
            responses.push(...responsesBatch);
        }
        catch(error){
            try{
                const responsesBlock = await getProductsByBlocks(getProductsDeps);
                responses.push(...responsesBlock);
            }
            catch(error){
                try{
                    const responsesByOne = await getProductsByOne(getProductsDeps);
                    responses.push(...responsesByOne);
                }catch(error){
                    console.log(error)
                }
            }
        }

        const jsonPromises:Promise<{Items:Product[]}>[] = [];
        responses.forEach((response)=>{
            if(response.ok) 
            jsonPromises.push(response.json())   
        })

        const allProducts:Product[] = [];
        await Promise.all(jsonPromises).then((products)=>{
            products.forEach(({Items})=>{
                allProducts.push(...Items);
            })
        })
        
        allProducts.push(...Items);
        return allProducts
    }
    catch(error){
        revalidateTag('accountProducts')
        return [] as Product[]
    }
}


const updateProduct = ({product,token}:{product:Product,token:string})=>{
    product.Estado = 'Activo'?'A':'I';
    product.Tipo = 'Producto'?'P':'C';

    const endpoint ="https://rest.contabilium.com/api/conceptos/?id="+product.Id;
    const fetchConfig = {
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        body:JSON.stringify(product),
        cache:'no-store'
    }
    return fetch(endpoint,fetchConfig as RequestInit)
}

export const updateAccountProducts = async ({token,products}:{token:string,products:Product[]})=>{
    if(!products.length)
    return [];
    
    const updateBlockOfProducts = ({blockProducts}:{blockProducts:Product[]})=>{
        const blockReqPromises = blockProducts.map(product=>updateProduct({product,token}))
        return blockReqPromises;
    }

    const productsBlocks = products.reduce((acc,_,index)=>{
        if(index%200 === 0)
        acc.push(products.slice(index,index+1000))

        return acc;
    },[] as Product[][])

    const responses:Response[] = []
    for (const blockProducts of productsBlocks) {
        const blockReqPromises = updateBlockOfProducts({blockProducts})
        const blockResponses = await Promise.all(blockReqPromises);
        responses.push(...blockResponses);
    }

    const responsesStatus = responses.map((response,index)=>{
        const id = products[index].Id;
    
        if(response.ok)
        return {id,status:true};

        else 
        return {id,status:false};
    })

    return responsesStatus;
}