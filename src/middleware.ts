import { NextResponse, type NextRequest } from "next/server"
// import { AccountTypeKey } from "./types/Config"
import { CbTokenKey } from "./types/Contabilium";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { CbCredentialsKeys } from "./types/CookiesStore";
import { errorCodes } from "./constants/opciones/notifications";
import { ACTIONS_KEYS } from "./constants/opciones/actions";

const {missingCbCredentialsBoth,missingCbCredentialsMain,missingCbCredentialsSecondary} = errorCodes
// const accountTypeKey:AccountTypeKey = "accountType";

const initCreateIsSet= (cookiesStore:RequestCookies)=><T extends string[]>(keys:T)=>{
    for(const key of keys){
        if(!cookiesStore.has(key))
        return false;
    }
    return true
} 

export const middleware = async (request:NextRequest)=>{
    const createIsSet = initCreateIsSet(request.cookies)
    // const isSetAccountType = createIsSet<AccountTypeKey[]>(['accountType']);
    const isSetMainCbCredentials = createIsSet<CbCredentialsKeys>(['userMain','passMain']);
    const isSetSecondaryCbCredentials = createIsSet<CbCredentialsKeys>(['userSecondary','passSecondary']);
    const isSetTokens = createIsSet<CbTokenKey[]>(['tokenMain','tokenSecondary']);
    
    // if(!isSetAccountType)
    // return NextResponse.redirect(request.nextUrl.origin+'/api/opciones/'+accountTypeKey)
    
    let error = ''
        
    if(!isSetMainCbCredentials)
    error = missingCbCredentialsMain;

    if(!isSetSecondaryCbCredentials)
    error = missingCbCredentialsSecondary;

    if(!isSetMainCbCredentials && !isSetSecondaryCbCredentials)
    error = missingCbCredentialsBoth;

    if(error)
    return NextResponse.redirect(request.nextUrl.origin+'/opciones/contabilium?notification='+error)

    if(!isSetTokens)
    return NextResponse.redirect(request.nextUrl.origin+'/api/opciones/contabilium?action='+ACTIONS_KEYS.refreshToken);

    return NextResponse.next()
}

export const config = {
    matcher:['/listas/:path*','/','/opciones','/opciones/cotizaciones',]
}