import { ListaFieldsProps } from "@/types/AgregarTypes";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";
import { useRef } from "react";
import containerStyles from '@/styles/containers.module.css'
import { LabelWrapper } from "../LabelWrapper";
import { Select } from "../Select";
import { getSerializedVendors, getVendorsOptionList } from "@/utils/vendors";
import { tipoOptionList } from "@/constants/tipoOptionsList";


export const ListaFields:React.FC<ListaFieldsProps> = ({vendors,setNameVendorAndType})=>{
    
    const vendorsOptionsList = getVendorsOptionList({vendors});
    const serializedVendors = getSerializedVendors({vendors});

    const submitHandler = async ()=>{
        const {inListas} = await dbListasUtils();

        const name = (nameRef.current as HTMLInputElement).value;
        const vendorId = (vendorIdRef.current as HTMLSelectElement).value;
        const type = (typeRef.current as HTMLSelectElement).value  as 'main' | 'both' | 'secondary' | 'none';
        
        if(!name || vendorId === 'none' || type === 'none'){
            alert('Ningun campo puede estar vacio.')
            return;
        }
        
        if (await inListas({name})){
            alert('Este titulo ya existe.')
            return;
        }
        
        const {NombreFantasia,RazonSocial} = serializedVendors[vendorId]
        const vendor = NombreFantasia || RazonSocial

        setNameVendorAndType({name,vendor,vendorId:Number(vendorId),type:type})
    }

    const nameRef = useRef<HTMLInputElement>(null);
    const vendorIdRef = useRef<HTMLSelectElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    
    return (
        <div className={`${containerStyles.container} flex-row flex-space-between`}>
            <div className='flex-row flex-gap-s'>
                <LabelWrapper labelText='Titulo'>
                    <input type="text" id='titulo' ref={nameRef}/>
                </LabelWrapper>
                <LabelWrapper labelText='Proveedor'>
                    <Select fieldRef={vendorIdRef} type={'select'} name='provedoor' optionList={vendorsOptionsList} placeholder='Proveedor'/>
                </LabelWrapper>
                <LabelWrapper labelText='Tipo'>
                    <Select fieldRef={typeRef} type={'select'} name='tipo' optionList={tipoOptionList} placeholder='Tipo'/>
                </LabelWrapper>
            </div>
            <input onClick={submitHandler} type="submit" value="confirmar" />
        </div>
    )
}