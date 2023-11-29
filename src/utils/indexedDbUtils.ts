import { DATABASE } from "@/constants/database";
import { DatabaseFactory } from "@/types/DatabaseFactory";

const openDatabase = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {      
        const request = window.indexedDB.open(DATABASE.NAME, 5);
        
        request.onupgradeneeded = (event:IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            if(!db.objectStoreNames.contains(DATABASE.OBJECTS_STORE.movimientos)){
                const movimientosObjectStore = db.createObjectStore(DATABASE.OBJECTS_STORE.movimientos, { keyPath: "id", autoIncrement: true });
                movimientosObjectStore.createIndex("fuente", "fuente", { unique: false });
                movimientosObjectStore.createIndex("proveedor", "proveedor", { unique: false });
            }
            
            if(!db.objectStoreNames.contains(DATABASE.OBJECTS_STORE.listas)){
                const listasObjectStore = db.createObjectStore(DATABASE.OBJECTS_STORE.listas,{keyPath:"id",autoIncrement:true});
                listasObjectStore.createIndex("proveedor","proveedor",{ unique: false});
                listasObjectStore.createIndex("titulo","titulo",{ unique: false});
            }
        }
    
        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        }
    
        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        }
    })
}
  
export const indexedDbUtils = async <ObjectStoreElement>(objectStoreName:string):Promise<DatabaseFactory<ObjectStoreElement>> => {
    const db = await openDatabase();

    const add = (elements:ObjectStoreElement[]):Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{

            const transaction:IDBTransaction = db.transaction([objectStoreName],'readwrite');
            const objectStore:IDBObjectStore = transaction.objectStore(objectStoreName);

            const addPromises:Promise<IDBValidKey>[] = elements.map((element)=>{
                return new Promise((resolve,reject)=>{
                    const request = objectStore.add(element);
                    request.onsuccess = ()=>{
                        resolve(request.result);
                    }
                })
            })

            transaction.oncomplete = ()=>{
                resolve(Promise.all(addPromises))
            }
                        
            // transaction.onerror = ()=>{
            //     reject(false);
            // }
        })
    }

    const update = (elements: (ObjectStoreElement&{id:number})[]): Promise<IDBValidKey[]> => {
        return new Promise((resolve, reject) => {
            const transaction: IDBTransaction = db.transaction([objectStoreName], 'readwrite');
            const objectStore: IDBObjectStore = transaction.objectStore(objectStoreName);
    
            const putPromises:Promise<IDBValidKey>[] = elements.map((element)=>{
                return new Promise((resolve,reject)=>{
                    const request = objectStore.put(element);
                    request.onsuccess = ()=>{
                        resolve(request.result);
                    }
                })
            })

            transaction.oncomplete = ()=>{
                resolve(Promise.all(putPromises))
            }
        });
    };

    const get = (idElements:number[]):Promise<(ObjectStoreElement&{id:number})[]> =>{
        return new Promise( async (resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);
            
            const getPromises:Promise<(ObjectStoreElement&{id:number})>[] = idElements.map((id)=>{
                return new Promise((resolve,reject)=>{
                    const request:IDBRequest<(ObjectStoreElement&{id:number})> = objectStore.get(id)
                    request.onsuccess = ()=>{
                        resolve(request.result);
                    }
                })
            })

            transaction.oncomplete = ()=>{
                resolve(Promise.all(getPromises))
            }
        })
    }

    const getAll = ():Promise<Record<number,(ObjectStoreElement&{id:number})>> =>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);

            const elements:Record<number,(ObjectStoreElement&{id:number})> = {};
            objectStore.openCursor().onsuccess = (event:Event)=>{
                const cursor = (event.target as IDBRequest<IDBCursorWithValue|null>).result;
                if(cursor){
                    const element = cursor.value;
                    elements[element.id] = element;
                    cursor.continue()
                }
                else
                resolve(elements)
            }

            // const request:IDBRequest<(ObjectStoreElement&{id:number})[]> = objectStore.getAll();
            // request.onsuccess = ()=>{
            //     resolve(request.result)
            // }
        })
    } 

    const getAllKeys = ():Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);

            const request = objectStore.getAllKeys();
            request.onsuccess = ()=>{
                resolve(request.result)
            }
        })
    }

    const remove = (idElements:IDBValidKey[]):Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName],'readwrite');
            const objectStore = transaction.objectStore(objectStoreName);

            const removePromises:Promise<IDBValidKey>[] = idElements.map((id)=>{
                return new Promise((resolve,reject)=>{
                    const request = objectStore.delete(id)
                    request.onsuccess = ()=>{
                        resolve(id);
                    }
                })
            })

            transaction.oncomplete = ()=>{
                resolve(Promise.all(removePromises))
            }
        })
    }
    

    return {get,getAll,getAllKeys,add,update,remove};
};


