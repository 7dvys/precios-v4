import { RubrosWithSubRubros } from "@/types/Contabilium";
import { revalidateTag } from "next/cache";

export const getAccountRubrosWithSubRubros = async ({token}:{token:string}):Promise<RubrosWithSubRubros> =>{
    try{
      const options:RequestInit = {
        method: 'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        next:{
          revalidate:1800,
          tags:['accountRubros']
        }
      };
      
      const response = await fetch("https://rest.contabilium.com/api/conceptos/rubros?includeChilds=true", options)
        // .then(response => response.text())
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
      
      if(!response.ok)
      return [];
      
      const rubrosWithSubRubrosJson:RubrosWithSubRubros = await response.json();

      if('error' in rubrosWithSubRubrosJson)
      return []

      return rubrosWithSubRubrosJson;
    }catch{
      revalidateTag('accountRubros')
      return []
    }
}