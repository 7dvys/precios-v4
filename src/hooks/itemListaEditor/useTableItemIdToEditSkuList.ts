import { useState } from "react";

export const useTableItemIdToEditSkuList = ()=>{
    const [tableItemIdToEditSkuList,setTableItemIdToEditSkuList] = useState<number[]>([]);

    const addTableItemIdToEditSkuList = (id:number)=>{
        setTableItemIdToEditSkuList(currentTableItemIdToEditSkuList=>{
            const idAlreadyExist = currentTableItemIdToEditSkuList.some(currentId=>id===currentId);
            
            if(!idAlreadyExist)
            return [...currentTableItemIdToEditSkuList,id];
            
            return currentTableItemIdToEditSkuList;
        })
    }

    const clearTableItemIdToEditSkuList = ()=>{
        setTableItemIdToEditSkuList([]);
    }

    const removeTableItemIdToEditSkuList = (id:number)=>{
        setTableItemIdToEditSkuList(currentTableItemIdToEditSkuList=>{
            const newTableItemIdToEditSkuList = currentTableItemIdToEditSkuList.filter(currentId=>currentId !== id);
            return newTableItemIdToEditSkuList;
        })
    }

    return {tableItemIdToEditSkuList,clearTableItemIdToEditSkuList,addTableItemIdToEditSkuList,removeTableItemIdToEditSkuList};
}