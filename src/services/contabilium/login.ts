import { CbToken } from "@/types/Contabilium";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

export const login = async ({user,password}:{user:string,password:string})=>{
    const url = 'https://rest.contabilium.com/token';

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    urlencoded.append("client_id", user);
    urlencoded.append("client_secret", password);
    
    const requestOptions:RequestInit = {
        method: 'POST',
        headers: headers,
        body: urlencoded,
    //   redirect: 'follow'
        cache:'no-store'
    };
    
    const cbToken:CbToken = await fetch(url, requestOptions).then(response=>response.json()).catch(error=>({error:error.message}))

    return cbToken;
}