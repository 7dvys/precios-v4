import { useState } from "react";

export const useTableItemIdToEditSkuList = ()=>{
    const [tableItemIdToEditSkuList,setTableItemIdToEditSkuList] = useState<number[]>([]);

    const addTableItemIdToEditSkuList = (id:number)=>{
        setTableItemIdToEditSkuList(currentTableItemIdToEditSkuList=>{
            const idAlreadyExist = currentTableItemIdToEditSkuList.some(currentId=>id===currentId);
            if(!idAlreadyExist)
            return [...currentTableItemIdToEditSkuList,id];
            else return currentTableItemIdToEditSkuList;
        })
    }

    const removeTableItemIdToEditSkuList = (id:number)=>{
        setTableItemIdToEditSkuList(currentTableItemIdToEditSkuList=>{
            const newTableItemIdToEditSkuList = currentTableItemIdToEditSkuList.filter(currentId=>currentId !== id);
            return newTableItemIdToEditSkuList;
        })
    }

    return {tableItemIdToEditSkuList,addTableItemIdToEditSkuList,removeTableItemIdToEditSkuList};
}