import { NextResponse, type NextRequest } from "next/server"
import { AccountTypeKey } from "./types/Config"
import { CbTokenKey } from "./types/Contabilium";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { CbCredentialsKeys } from "./types/CookiesStore";
import { missingCbCredentials } from "./constants/opciones/notifications";


const initCreateIsSet= (cookiesStore:RequestCookies)=><T extends string[]>(keys:T)=>{
    for(const key of keys){
        if(!cookiesStore.has(key))
        return false;
    }
    return true
} 

export const middleware = async (request:NextRequest)=>{
    const createIsSet = initCreateIsSet(request.cookies)
    const isSetAccountType = createIsSet<AccountTypeKey[]>(['accountType']);
    const isSetMainCbCredentials = createIsSet<CbCredentialsKeys>(['userMain','passMain']);
    const isSetSecondaryCbCredentials = createIsSet<CbCredentialsKeys>(['userSecondary','passSecondary']);
    const isSetContabiliumCredentials = isSetMainCbCredentials && isSetSecondaryCbCredentials;
    const isSetToken = createIsSet<CbTokenKey[]>(['tokenMain','tokenSecondary']);

    
    if(!isSetAccountType)
    return NextResponse.redirect(request.nextUrl.origin+'/api/opciones/accountType')

    // Si falta alguno
    
    let error = ''

    console.log(request.cookies.get('userMain'))
    
    if(!isSetMainCbCredentials)
    error = missingCbCredentials.main;

    if(!isSetSecondaryCbCredentials)
    error = missingCbCredentials.secondary;

    if(!isSetContabiliumCredentials)
    error = missingCbCredentials.both;

    if(error)
    return NextResponse.redirect(request.nextUrl.origin+'/opciones/contabilium?notification='+error)

    if(!isSetToken)
    return NextResponse.next()
}

export const config = {
    matcher:['/listas','/']
}