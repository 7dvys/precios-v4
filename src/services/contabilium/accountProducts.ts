import { AccountDeposits, Deposit, Deposits, Product, ProductStockByDeposits, StockByDeposit } from "@/types/Contabilium";
// import { revalidateTag } from "next/cache";

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
            cache:'no-store',
            // next:{
            //     revalidate:1800,
            //     tags:['accountProducts']
            // }
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
        await Promise.all(jsonPromises).then((accountProducts)=>{
            accountProducts.forEach(({Items})=>{
                allProducts.push(...Items);
            })
        })
        
        allProducts.push(...Items);


        return allProducts.filter(product=>product.Tipo === 'Producto')
    }
    catch(error){
        // revalidateTag('accountProducts')
        return [] as Product[]
    }
}

const getAccountProductStockByDeposit = async ({depositId,sku,token,depositName}:{depositName:string,depositId:number,sku:string,token:string}):Promise<{[depositName:string]:StockByDeposit|null}> =>{
    const location = `https://rest.contabilium.com/api/inventarios/getStockByDeposito?id=${depositId}&codigo=${sku}`;
    const config:RequestInit = {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        cache:'no-store',
    }

    const response = await fetch(location,config);
    if(!response.ok)
    return {[depositName]:null}


    const responseJson = await response.json();
    
    const stockByDeposit = responseJson.Items[0];

    return {[depositName]:stockByDeposit}
}

export const getAccountProductStockByDeposits = async ({accountDeposits,sku,token}:{accountDeposits:AccountDeposits,sku:string,token:string}):Promise<ProductStockByDeposits> =>{
    const productStockByDepositPromises = accountDeposits.map(({Id:depositId,Nombre:depositName})=>{
        return getAccountProductStockByDeposit({depositId,sku,token,depositName});
    })

    const productStockByDeposits = await Promise.all(productStockByDepositPromises);
    return productStockByDeposits.reduce((acc,productStockByDeposit)=>{
        const [depositName,stockByDeposit] = Object.entries(productStockByDeposit)[0]
        acc[depositName] = stockByDeposit;
        return acc
    },{} as ProductStockByDeposits)

} 

export const updateAccountProduct = ({product,token}:{product:Product,token:string})=>{
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

export const updateAccountProducts = async ({token,accountProducts}:{token:string,accountProducts:Product[]})=>{    
    if(!accountProducts.length)
    return {};
    
    const updateBlockOfProducts = ({blockProducts}:{blockProducts:Product[]})=>{
        const blockReqPromises = blockProducts.map(product=>updateAccountProduct({product,token}))
        return blockReqPromises;
    }

    const productsBlocks = accountProducts.reduce((acc,_,index)=>{
        if(index%200 === 0)
        acc.push(accountProducts.slice(index,index+200))

        return acc;
    },[] as Product[][])

    const responses:Response[] = []

    for (const blockProducts of productsBlocks) {
        const blockReqPromises = updateBlockOfProducts({blockProducts})
        const blockResponses = await Promise.all(blockReqPromises);
        responses.push(...blockResponses);
    }

    const responsesStatus = responses.reduce((acc,response,index)=>{
        const id = accountProducts[index].Id;
        acc[id] = response.ok === true? accountProducts[index]:false
        return acc;

    },{} as {[key:number]:Product|false})

    return responsesStatus;
}

export const getProductByCodigo = async ({codigo,token}:{codigo:string,token:string}):Promise<Product|{error:string}> =>{
    try{
      const options:RequestInit = {
        method: 'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        cache:'no-store'
      };
      
      const response = await fetch("https://rest.contabilium.com/api/conceptos/getByCodigo?codigo="+codigo, options)

      if(!response.ok)
      return {error:response.statusText};
      
      const productJson:Product|{error:string} = await response.json();

      if('error' in productJson)
      return {error:productJson.error}

      return productJson;
    }catch{
      return {error:'error desconocido'};
    }
}

export const createAccountProduct = async ({token,newProduct}:{token:string,newProduct:Omit<Product,'Id'>}):Promise<{id:number}|{error:string}>=>{
    try{
        const options:RequestInit = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token,
            },
            cache:'no-store',
            body:JSON.stringify(newProduct)
        };

        const endpoint = 'https://rest.contabilium.com/api/conceptos/';
        const response = await fetch(endpoint,options);

        if(!response.ok)
        return {error:response.statusText};

        const jsonResponse = await response.json();

        return {id:jsonResponse};
    }catch(error){
        return {error:'system error\n'+error}
    }
}

const updateAccountProductStockByDeposit = async ({token,depositId,productId,newStock}:{token:string,depositId:number,productId:number,newStock:number})=>{
    const endpoint = `https://rest.contabilium.com/api/inventarios/modificarStock?id=${depositId}&idConcepto=${productId}&cantidad=${newStock}`;
    const options:RequestInit = {
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        cache:'no-store',
    };
    const response = await fetch(endpoint,options);

    // const responseJson = await response.json();
    // console.log(responseJson)
    // console.log(response.statusText)
    // const text = await response.text()
    // console.log({text,depositId,newStock,productId})

    return response.ok;
}

export const updateAccountProductStock = async ({accountDeposits,productId,productStockByDeposits,token}:{accountDeposits:Deposit[],productId:number,productStockByDeposits:ProductStockByDeposits,token:string})=>{
    if(productStockByDeposits === null)
    return false;

    const updateAccountProductStockPromises = Object.entries(productStockByDeposits).map(([depositName,stockByDeposit])=>{
        if(stockByDeposit === null)
        return null

        const deposit = accountDeposits.find(deposit=>deposit.Nombre===depositName);

        if(deposit === undefined)
        return;

        return updateAccountProductStockByDeposit({token,depositId:deposit.Id,productId,newStock:stockByDeposit.StockConReservas})
    })

    const responses = await Promise.all(updateAccountProductStockPromises)
    return !responses.some(response=>{
        if(response === null)
        return true;

        return !response;
    })
    
}