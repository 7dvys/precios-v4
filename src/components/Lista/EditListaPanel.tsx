import containerStyles from '@/styles/containers.module.css';
import { LabelWrapper } from '../LabelWrapper';
import { Dispatch, SetStateAction, useRef } from 'react';
import { Lista } from '@/types/Listas';
import { AccountType } from '@/types/Config';

type EditListaPanelProps = {
    setReadOnly:Dispatch<SetStateAction<boolean>>,
    readOnly:boolean,
    changeListaAllCosts:({factor}:{factor:number})=>void
    lista:Lista
    saveLista:()=>Promise<void>
    setType:({type}:{type:AccountType | "both"})=>void
}

export const EditListaPanel:React.FC<EditListaPanelProps> = ({setReadOnly,setType,saveLista,readOnly,changeListaAllCosts,lista})=>{    
    
    
    const editListaHandler = ()=>{
        setReadOnly(current=>!current)
    }

    const changeAllCostHandler = ()=>{
        const changeValue = Number((massiveChangeFactorRef.current as HTMLInputElement).value);
        if(isNaN(changeValue))
        return alert('el factor debe ser un numero.');

        if(changeValue === 0)
        return alert('el factor no puede ser 0');
    
        const changeFactor = (changeValue/100)+1;

        if(confirm(`esta seguro que quiere modificar un ${changeValue}%`))
        return changeListaAllCosts({factor:changeFactor});
        // uppload lista
    }

    const setTypeHandler = ()=>{
        const newType:AccountType|'both' = (typeRef.current as HTMLSelectElement).value as AccountType|'both' ;
        setType({type:newType})
        saveLista()
    }

    const massiveChangeFactorRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    
    return (
        <div className={`${containerStyles.container} flex-row flex-space-between`}>
            <div className='flex-row flex-gap-m'>

                <LabelWrapper labelText='Titulo'>
                    <input type="text" id='titulo' disabled={true} value={lista.name}/>
                </LabelWrapper>
                <LabelWrapper labelText='Proveedor'>
                    <input value={lista.vendor} type='text' name='provedoor' disabled={true}/>
                </LabelWrapper>
                <LabelWrapper labelText='Tipo'>
                    <div className='flex-row flex-gap-m'>
                        <select value={lista.type} onChange={setTypeHandler} disabled={readOnly} ref={typeRef} name="tipo" id="type">
                            <option value="both">ambas</option>
                            <option value="main">primaria</option>
                            <option value="secondary">secundaria</option>
                        </select>
                    </div>
                </LabelWrapper>
                <LabelWrapper labelText='Modificacion masiva'>
                    <div className='flex-row flex-gap-m'>
                        <input ref={massiveChangeFactorRef} type="number" name="factor" disabled={readOnly}/>
                        <input onClick={changeAllCostHandler} type="button" value="aceptar" disabled={readOnly}/>
                    </div>
                </LabelWrapper>
            </div>

            <div className='flex-row flex-gap-s'>
                {/* <input type="button" value="actualizar cotizaciones" /> */}
                <input onClick={editListaHandler} type="button" value={readOnly?'editar lista':'terminar edicion'} />
                {/* <input type="button" value="exportar lista" /> */}
                {/* <input type="button" value="eliminar lista" /> */}
            </div>
        </div>
    )
}