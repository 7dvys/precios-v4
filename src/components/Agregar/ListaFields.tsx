import { ListaFieldsProps } from "@/types/AgregarTypes";
import { Option } from "@/types/FormFields";
import { listasUtils } from "@/utils/listas/listasUtils";
import { useRef } from "react";
import containerStyles from '@/styles/containers.module.css'
import { Lista } from "@/types/Listas";
import { LabelWrapper } from "../LabelWrapper";
import { Select } from "../Select";


export const ListaFields:React.FC<ListaFieldsProps> = ({vendors,setLista})=>{
    
    const tituloRef = useRef<HTMLInputElement>(null);
    const proveedorRef = useRef<HTMLSelectElement>(null);
    const tipoRef = useRef<HTMLSelectElement>(null);
    
    const vendorOptionList:Option[] = vendors.map(({Id,NombreFantasia,RazonSocial})=>({value:Id.toString(),title:NombreFantasia||RazonSocial}))

    const tipoOptionList:Option[] = [
        {value:'main',title:'principal'},
        {value:'both',title:'ambas'},
        {value:'secondary',title:'secundaria'},
    ]

    const submitHandler = async ()=>{
        const {inListas} = await listasUtils();

        const titulo = (tituloRef.current as HTMLInputElement).value;
        const proveedorId = (proveedorRef.current as HTMLSelectElement).value;
        const tipo = (tipoRef.current as HTMLSelectElement).value  as 'main' | 'both' | 'secondary' | 'none';
        
        if(!titulo || proveedorId === 'none' || tipo === 'none'){
            alert('Ningun campo puede estar vacio.')
            return;
        }
        
        if (await inListas({titulo})){
            alert('Este titulo ya existe.')
            return;
        }
        
        const proveedor = vendorOptionList.find(({value})=>proveedorId===value)?.title as string; 
            
        setLista(lista=>{
            const newLista:Lista = {...lista,titulo,proveedorId:Number(proveedorId),proveedor,type:tipo}
            return newLista
        })
    }
    
    return (
        <div className={`${containerStyles.container} flex-row flex-space-between`}>
            <div className='flex-row flex-gap-s'>
                <LabelWrapper labelText='Titulo'>
                    <input type="text" id='titulo' ref={tituloRef}/>
                </LabelWrapper>
                <LabelWrapper labelText='Proveedor'>
                    <Select fieldRef={proveedorRef} type={'select'} name='provedoor' optionList={vendorOptionList} placeholder='Proveedor'/>
                </LabelWrapper>
                <LabelWrapper labelText='Tipo'>
                    <Select fieldRef={tipoRef} type={'select'} name='tipo' optionList={tipoOptionList} placeholder='Tipo'/>
                </LabelWrapper>
            </div>
            <input onClick={submitHandler} type="submit" value="confirmar" />
        </div>
    )
}