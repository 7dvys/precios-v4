export type DatabaseFactory<ObjectStoreElement> = {
    add:(movements: ObjectStoreElement[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    update:(movements: ObjectStoreElement[])=> Promise<IDBValidKey[]>;
    remove:(idMovements: number[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    get:(idMovements: number[]) => Promise<ObjectStoreElement[]>; 
    getAll:() => Promise<ObjectStoreElement[]>,
    getAllKeys:()=>Promise<IDBValidKey[]>, // return all keys
}  
