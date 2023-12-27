import containerStyles from '@/styles/containers.module.css';
import { LabelWrapper } from '../LabelWrapper';
import { Dispatch, SetStateAction, useRef } from 'react';

type EditListaPanelProps = {
    setReadOnly:Dispatch<SetStateAction<boolean>>,
    readOnly:boolean,
    changeListaAllCosts:({factor}:{factor:number})=>void
}

export const EditListaPanel:React.FC<EditListaPanelProps> = ({setReadOnly,readOnly,changeListaAllCosts})=>{    
    
    
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

    const massiveChangeFactorRef = useRef<HTMLInputElement>(null);
    
    return (
        <div className={`${containerStyles.container} flex-row flex-space-between`}>
                <LabelWrapper labelText='Modificacion masiva'>
                    <div className='flex-row flex-gap-m'>
                        <input ref={massiveChangeFactorRef} type="number" name="factor" disabled={!readOnly}/>
                        <input onClick={changeAllCostHandler} type="button" value="aceptar" disabled={!readOnly}/>
                    </div>
                </LabelWrapper>
            <div className='flex-row flex-gap-s'>
                {/* <input type="button" value="actualizar cotizaciones" /> */}
                <input onClick={editListaHandler} type="button" value={readOnly?'editar lista':'terminar edicion'} />
                {/* <input type="button" value="exportar lista" /> */}
                {/* <input type="button" value="eliminar lista" /> */}
            </div>

        </div>
    )
}