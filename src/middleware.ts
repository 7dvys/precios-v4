import { NextResponse, type NextRequest } from "next/server"
import { AccountTypeKey } from "./types/Config"
import { CbCredentials, CbTokenKey } from "./types/Contabilium";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";


const initCreateIsSet= (cookiesStore:RequestCookies)=><T extends string[]>(keys:T)=>{
    for(const key of keys){
        if(!cookiesStore.has(key))
        return false;
    }
    return true
} 

export const middleware = async (request:NextRequest)=>{

    const createIsSet = initCreateIsSet(request.cookies)
    const isSetAccountType = createIsSet<AccountTypeKey[]>(['accountType'])
    const isSetContabiliumCredentials = createIsSet<(keyof CbCredentials)[]>(['userMain','passMain','userSecondary','passSecondary'])
    const isSetToken = createIsSet<CbTokenKey[]>(['tokenMain','tokenSecondary'])

    
    if(!isSetAccountType)
    return NextResponse.redirect(request.nextUrl.origin+'/api/opciones')

    if(!isSetContabiliumCredentials)
    return NextResponse.redirect(request.nextUrl.origin+'/opciones')

    if(!isSetToken)
    return NextResponse.next()
}

export const config = {
    matcher:['/listas','/']
}