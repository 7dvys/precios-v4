import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys"
import { cbLoginSuccess, duplicatedCbCredentials, loginTokenError, setCredentialsError } from "@/constants/opciones/notifications";
import { login } from "@/services/contabilium/login"
import { AccountType, AccountTypeKey } from "@/types/Config";
import { CbToken } from "@/types/Contabilium";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server"

const {userMain,passMain,userSecondary,passSecondary,cbTokenMain,cbTokenSecondary} = CONTABILIUM_KEYS;

const setCbToken = ({token,accountType}:{token:CbToken,accountType:AccountType})=>{
    const {access_token,expires_in} = token;
    const cbTokenKey = accountType == 'main'?cbTokenMain:cbTokenSecondary;
    cookies().set(cbTokenKey,access_token,{maxAge:expires_in})
}

const sendCbCredentialsToOpciones = async({url,user,password,accountType}:{url:string,user:string,password:string,accountType:AccountType})=>{
    const accountTypeKey:AccountTypeKey = 'accountType';
    const userKey = accountType=='main'?userMain:userSecondary;
    const passKey = accountType=='main'?passMain:passSecondary;

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Origin", url);

    
    const urlencoded = new URLSearchParams();
    urlencoded.append(userKey, user);
    urlencoded.append(passKey, password);
    urlencoded.append(accountTypeKey, accountType);
    
    
    const requestOptions:RequestInit = {
        method: 'POST',
        headers: headers,
        body: urlencoded,
        cache:'no-store',
        credentials:'same-origin',
    };

    const setCredentialsResponse = await fetch(url,requestOptions);
    return setCredentialsResponse.ok
}

const isSetCbCredentials = ({accountType}:{accountType:AccountType})=>{
    const cookiesStore = cookies();
    const userKey = accountType=='main'?userMain:userSecondary;
    const passKey = accountType=='main'?passMain:passSecondary;

    return (cookiesStore.has(userKey) && cookiesStore.has(passKey))
}

const isDuplicatedCbCredentials = ({user,password}:{user:string,password:string})=>{
    const cookiesStore = cookies();
    (['main','secondary'] as AccountType[]).forEach(accountType=>{
        if(isSetCbCredentials({accountType})){
            const userKey = accountType=='main'?userMain:userSecondary;
            const passKey = accountType=='main'?passMain:passSecondary;

            const isSameUser = cookiesStore.get(userKey)??'' == user;
            const isSamePass = cookiesStore.get(passKey)??'' == password;

            if(isSameUser && isSamePass)
            return true;
        }
    })
    return false;
}

export const POST = async(request:NextRequest,)=>{
    const formData = await request.formData()

    const isMainAccount = formData.has(userMain) && formData.has(passMain)
    const isSecondaryAccount = formData.has(userSecondary) && formData.has(passSecondary)

    if(isMainAccount || isSecondaryAccount){
        let notification = '';

        const user = (isMainAccount?formData.get(userMain):formData.get(userSecondary)) as string;
        const password = (isMainAccount?formData.get(passMain):formData.get(passSecondary)) as string;
        const accountType:AccountType = isMainAccount?'main':'secondary';

        const token = await login({user,password})
        
        if(!token.error){
            // Login Success!!
            const url = request.nextUrl.origin+'/api/opciones/contabiliumCredentials';
            const response = await sendCbCredentialsToOpciones({url,user,password,accountType})

            if(!response)
            notification = setCredentialsError;

            else{
                setCbToken({token,accountType});
                notification = accountType == 'main'?cbLoginSuccess.main:cbLoginSuccess.secondary
            }
        }

        else 
        notification = accountType == 'main'?loginTokenError.main:loginTokenError.secondary;

        return Response.redirect(request.nextUrl.origin+'/opciones/contabilium?notification='+notification);
    }

    return Response.redirect(request.nextUrl.origin);
}