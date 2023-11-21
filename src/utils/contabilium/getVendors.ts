import { getAccountVendors } from "@/services/contabilium/accountVendors";
import { Vendor } from "@/types/Contabilium";
// import { revalidateTag } from "next/cache";
// import { cookies } from "next/headers";

export const getVendors = async ({cbTokenMain}:{cbTokenMain:string}):Promise<Vendor[]> =>{
    const mainVendors:Vendor[] = await getAccountVendors({token:cbTokenMain});
    return mainVendors;
}

// export const getVendors = async ()=>{
//     let vendors:Vendor[] = [];
//     const baseUrl = 'http://127.0.0.1:3000';

//     const config:RequestInit = {
//         method:'GET',
//         credentials:'include',
//         headers:{
//             Cookie:cookies().toString()
//         },
//         cache:'no-store'
//     }
//     const vendorsResponse = await fetch(baseUrl+'/api/contabilium/vendors',config)

//     if(vendorsResponse.ok)
//     vendors = await vendorsResponse.json();

//     return vendors;
// }   

