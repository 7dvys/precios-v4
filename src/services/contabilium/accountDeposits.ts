import { AccountDeposits } from "@/types/Contabilium";

export const getAccountDeposits = async ({token}:{token:string}):Promise<AccountDeposits> =>{
    const location = 'https://rest.contabilium.com/api/inventarios/getDepositos';
    const config:RequestInit = {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        cache:'no-store',
    }

    const response =await fetch(location,config);
    if(!response.ok)
    return [];

    const responseJson:AccountDeposits = await response.json();
    return responseJson;
}