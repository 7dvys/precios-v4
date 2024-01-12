import addSkuModalStyles from '@/styles/addSkuModal.module.css' 
import { RefObject } from "react";
import { LabelWrapper } from "../LabelWrapper";

export const SkuEditorCreateSku:React.FC<{
    newProductTitleRef:RefObject<HTMLInputElement>,
    // newProductStockRef:RefObject<HTMLInputElement>,
    title:string|null,
    codigo:string
}> = ({newProductTitleRef,title,codigo})=>{    
    return (
    <div className={"flex-column "+addSkuModalStyles.addedSkuLabel}>
        <LabelWrapper labelText="nuevo producto">
            <div className='flex-row flex-gap-s'>
                <input ref={newProductTitleRef} type="text" placeholder='titulo' defaultValue={title||codigo}/>
                {/* <input ref={newProductStockRef} type="number" min={0} placeholder='stock'/> */}
            </div>
        </LabelWrapper>
    </div>
    )
}