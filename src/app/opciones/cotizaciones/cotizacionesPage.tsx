'use client'
import { ContabiliumContext } from '@/contexts/ContabiliumContext';
import containerStyles from '@/styles/containers.module.css'
import { Cotizaciones } from "@/types/Cotizaciones";
import { updateProductsCotizaciones } from '@/utils/contabilium/updateProductsCotizaciones';
import { cotizacionesUtils } from '@/utils/cotizaciones/cotizacionesUtils';
import { useContext, useEffect, useRef, useState } from "react";
import { UpdateProductsModal } from '@/components/UpdateProductsModal';

export const CotizacionesPage:React.FC = ()=>{
    const [cotizaciones,setCotizaciones] = useState<Cotizaciones>({});
    const {fixedProducts,tokens,updateProducts:updateContextProducts} = useContext(ContabiliumContext); 
    const [onUpdateCotizacionesQueue,setOnUpdateCotizacionesQueue] = useState<{title:string,value:number}[]>([])

    const addUpdateCotizacionToQueue = (newCotizaciones:{title:string,value:number}[])=>{
        setOnUpdateCotizacionesQueue(current=>([...current,...newCotizaciones]));
    }

    const cleanUpdateCotizacionesQueue = ()=>{
        setOnUpdateCotizacionesQueue([]);
    }

    const initUpdateProducts = async () =>{
        const updatedProductsStatus = await updateProductsCotizaciones({fixedProducts,onUpdateCotizacionesQueue,tokens});
        return updatedProductsStatus;
    }

    const runUpdateProductsModal = onUpdateCotizacionesQueue.length>0; 

    const modifyHandler = async ()=>{
        let error = '';
        const {value:title} = (cotizacionesRef.current as HTMLSelectElement)

        if(title === 'blue' || title === 'oficial' || title === 'peso')
        return alert('no puedes modificar blue, oficial o peso.');

        const {getCotizaciones,updateCotizacion,removeCotizacion} = await cotizacionesUtils({products:fixedProducts});

        const currentCotization = cotizaciones[title]
        
        let value = prompt(`[!] Nueva cotizacion para ${title} o escriba 'eliminar'.`,currentCotization.toString())??0;

        if(value === 'eliminar'){
            setCotizaciones(removeCotizacion({title}))
            return;
        }

        value = Number(value);

        if(isNaN(value))
        error = '[!] Ingresa un valor numerico valido.';

        if(value < 0)
        error = '\n[!] Ingresa un valor mayor a cero.';

        if(value === 0)
        return;

        if(value === currentCotization)
        return;

        if(error)
        return alert(error);

        updateCotizacion({title,value});
        setCotizaciones(getCotizaciones()); 
        
        if(!confirm('desea actualizar los productos a la nueva cotizacion?'))
        return;

        addUpdateCotizacionToQueue([{title,value}]);
    }

    const updateDolar = async ()=>{   
        if(!confirm('desea actualizar los productos a la nueva cotizacion del dolar blue y oficial?'))
        return;

        const {getCotizaciones} = await cotizacionesUtils({products:fixedProducts});
        const currentCotizaciones = getCotizaciones()
        const {['blue']:dolarBlue,['oficial']:dolarOficial} = currentCotizaciones; 
        addUpdateCotizacionToQueue([{title:'blue',value:dolarBlue},{title:'oficial',value:dolarOficial}]);
    }

    const addHandler = async ()=>{
        const {getCotizaciones,updateCotizacion} = await cotizacionesUtils({products:fixedProducts});

        let error = '';
        const title = (nombreRef.current as HTMLInputElement).value
        const value = Number((newCotizacionRef.current as HTMLInputElement).value)

        if(!title)
        error += '[!] Agrega un titulo.';

        if(value <= 0)
        error += '\n[!] Ingresa un valor mayor a 0';

        if(!error){
            updateCotizacion({title,value})
            setCotizaciones(getCotizaciones())
            alert(`[!] ${title} agregado a 1usd = $${value}`);
        }
        
        else 
        alert(error);
    }

    useEffect(()=>{
        const initCotizaciones = async ()=>{
            const {getCotizaciones} = await cotizacionesUtils({products:fixedProducts});
            const currentCotizaciones = getCotizaciones();
            setCotizaciones(currentCotizaciones);
        }

        initCotizaciones();
    },[])

    const cotizacionesRef = useRef<HTMLSelectElement>(null);
    const nombreRef = useRef<HTMLInputElement>(null);
    const newCotizacionRef = useRef<HTMLInputElement>(null);

    return(
        <>
            <div className='flex-row flex-gap'>
                <div className={`${containerStyles.container} ${containerStyles['container--form']}`}>
                    <h3>Cotizaciones</h3>
                    <button onClick={updateDolar} title='actualizar dolar blue y oficial' >actualizar dolar</button>
                    <select ref={cotizacionesRef} name="cotizaciones">
                        {Object.entries(cotizaciones).map(([key,value],index)=>(
                            <option key={index} value={key}>{key}: {value}</option>
                        ))}
                    </select>
                    <button onClick={modifyHandler}>modificar</button>
                    <label>agregar</label>
                    <div>
                        <input ref={nombreRef} type="text" placeholder="nombre" name="nombre"/>
                        <input ref={newCotizacionRef} type="number" placeholder="cotizacion" name="cotizacion"/>    
                    </div>
                    <button onClick={addHandler}>aceptar</button>
                </div>
            </div>
            {runUpdateProductsModal && <UpdateProductsModal cleanQueue={cleanUpdateCotizacionesQueue} updateContextProducts={updateContextProducts} initUpdateProducts={initUpdateProducts}/>}
        </>

    )
}
