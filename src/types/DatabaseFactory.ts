export type DatabaseFactory<ObjectStoreElement> = {
    add:(elements: ObjectStoreElement[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    update:(elements: (ObjectStoreElement&{id:number})[])=> Promise<IDBValidKey[]>;
    remove:(idElements: number[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    get:(idElements: number[]) => Promise<(ObjectStoreElement&{id:number})[]>; 
    getAll:() => Promise<Record<number,(ObjectStoreElement&{id:number})>>,
    getAllKeys:()=>Promise<IDBValidKey[]>, // return all keys
}  
