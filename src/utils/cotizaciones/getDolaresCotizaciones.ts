export const getDolaresCotizaciones = async ()=>{
    let blue = 0,oficial = 0; 

    const apiDolares = await fetch('https://dolarapi.com/v1/dolares',{next:{revalidate:3600}});
    if(apiDolares.ok){
        const cotizacionesJson = await apiDolares.json();
        blue = Number(cotizacionesJson.filter((cotizacion:{casa:string,})=>(cotizacion.casa == 'blue'))[0].venta);
        oficial = Number(cotizacionesJson.filter((cotizacion:{casa:string,})=>(cotizacion.casa == 'oficial'))[0].venta);
    }
    return ({blue,oficial});
}