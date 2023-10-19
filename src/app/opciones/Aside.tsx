import { useCustomParameterManager } from "@/hooks/useCustomParameterManager";
import { FieldsGroupList } from "@/types/FormFields";

const Aside:React.FC = ()=>{
    const fieldsGroupList:FieldsGroupList = [
        {
            // label:'columnas',
            fields:[
                {name:'opcion',type:'select',optionList:[{value:'contabilium'},{value:'cotizaciones'}]},
            ]
        }
    ]

    const {ParameterManager,fieldGroupRefs} = useCustomParameterManager({title:'Opciones',fieldsGroupList})
    const buttonC = ()=>{
        console.log(fieldGroupRefs)
    }
    return (
        <>
            <ParameterManager submitFunction={buttonC}/>
        </>
    )
}

export default Aside;