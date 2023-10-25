export const getProducts = async ()=>{
    const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`
    const productsResponse = await fetch(baseUrl+'/api/contabilium/products',{cache:'no-store'})
    
    if(productsResponse.ok){
        const products = await productsResponse.json();
        console.log(products)
        return products;
    }

    else
    return {}
}   