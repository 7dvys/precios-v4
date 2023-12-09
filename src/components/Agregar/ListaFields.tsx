import { ListaFieldsProps } from "@/types/AgregarTypes";
import { dbListasUtils } from "@/utils/listas/dbListasUtils";
import { useRef } from "react";
import containerStyles from '@/styles/containers.module.css'
import { LabelWrapper } from "../LabelWrapper";
import { Select } from "../Select";
import { getSerializedVendors, getVendorsOptionList } from "@/utils/vendors";
import { tipoOptionList } from "@/constants/tipoOptionsList";
import { Options } from "../Options";


export const ListaFields:React.FC<ListaFieldsProps> = ({vendors,setNameVendorAndType,lista})=>{
    const defaultName = lista.name;
    const defaultVendorId = lista.vendorId === 0?'none':lista.vendorId.toString();
    const defaultType = lista.type;
    
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
                    <input type="text" id='titulo' placeholder={defaultName} defaultValue={defaultName} ref={nameRef}/>
                </LabelWrapper>
                <LabelWrapper labelText='Proveedor'>
                    <select ref={vendorIdRef} defaultValue={defaultVendorId} name='provedoor'>
                        <Options placeholder="Proveedor" optionList={vendorsOptionsList}/>
                    </select>
                </LabelWrapper>
                <LabelWrapper labelText='Tipo'>
                    <select ref={typeRef} defaultValue={defaultType} name='tipo' >
                        <Options optionList={tipoOptionList} placeholder='Tipo'/>
                    </select>
                </LabelWrapper>
            </div>
            <input onClick={submitHandler} type="submit" value="confirmar" />
        </div>
    )
}