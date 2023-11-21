export type DatabaseFactory<ObjectStoreElement> = {
    add:(elements: ObjectStoreElement[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    update:(elements: ObjectStoreElement[])=> Promise<IDBValidKey[]>;
    remove:(idElements: number[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    get:(idElements: number[]) => Promise<ObjectStoreElement[]>; 
    getAll:() => Promise<ObjectStoreElement[]>,
    getAllKeys:()=>Promise<IDBValidKey[]>, // return all keys
}  
