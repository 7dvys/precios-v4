import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys"
import { errorCodes } from "@/constants/opciones/notifications";
import { login as cbLogin} from "@/services/contabilium/login"
import { AccountType, AccountTypeKey } from "@/types/Config";
import { type NextRequest } from "next/server"
import utils from "../opcionesUtils";

const {userMainKey,passMainKey,userSecondaryKey,passSecondaryKey} = CONTABILIUM_KEYS;
const {cbLoginSuccessMain,cbLoginSuccessSecondary,loginTokenErrorMain,loginTokenErrorSecondary,refreshTokenError,refreshTokenSuccess} = errorCodes;

const login = async(request:NextRequest)=>{
    const formData = await request.formData()

    const isMainAccount = formData.has(userMainKey) && formData.has(passMainKey)
    const isSecondaryAccount = formData.has(userSecondaryKey) && formData.has(passSecondaryKey)

    if(isMainAccount || isSecondaryAccount){
        let notification = '';

        const user = (isMainAccount?formData.get(userMainKey):formData.get(userSecondaryKey)) as string;
        const password = (isMainAccount?formData.get(passMainKey):formData.get(passSecondaryKey)) as string;
        const accountType:AccountType = isMainAccount?'main':'secondary';
        const {setCbToken,setCbCredentials,resolveDuplicatedCbCredentials} = utils({accountType});

        const token = await cbLogin({user,password});
        
        if(!token.error){         
            resolveDuplicatedCbCredentials({user,password});
            setCbCredentials({user,password});
            setCbToken({token});
            notification = accountType == 'main'?cbLoginSuccessMain:cbLoginSuccessSecondary;
        }

        else 
        notification = accountType == 'main'?loginTokenErrorMain:loginTokenErrorSecondary;

        return Response.redirect(request.nextUrl.origin+'/opciones/contabilium?notification='+notification);
    }
    return Response.redirect(request.nextUrl.origin);
}

const refreshTokens = async(request:NextRequest)=>{
    let notification = '';
    const cookiesStore = request.cookies;
    const isSetMainCbCredentials = cookiesStore.has(userMainKey) && cookiesStore.has(passMainKey);
    const isSetSecondaryCbCredentials = cookiesStore.has(userSecondaryKey) && cookiesStore.has(passSecondaryKey);
    
    if(isSetMainCbCredentials && isSetSecondaryCbCredentials){
        const mainAccountType:AccountType = 'main';
        const secondaryAccountType:AccountType = 'secondary';
        const {setCbToken:setMainCbToken} = utils({accountType:mainAccountType})
        const {setCbToken:setSecondaryCbToken} = utils({accountType:secondaryAccountType})

        const userMain = cookiesStore.get(userMainKey)?.value as string;
        const passMain = cookiesStore.get(passMainKey)?.value as string;
        const userSecondary = cookiesStore.get(userSecondaryKey)?.value as string;
        const passSecondary = cookiesStore.get(passSecondaryKey)?.value as string;

        const mainToken = await cbLogin({user:userMain,password:passMain});
        const secondaryToken = await cbLogin({user:userSecondary,password:passSecondary});

        if(!mainToken && !secondaryToken){
            setMainCbToken({token:mainToken});
            setSecondaryCbToken({token:secondaryToken});
            notification = refreshTokenSuccess;
        }

        else 
        notification = refreshTokenError;
    }

    else
    return Response.redirect(request.nextUrl.origin+'?notification='+notification);
}

const logout = (request:NextRequest)=>{
    const { searchParams } = new URL(request.url)
    const accountTypeKey:AccountTypeKey = 'accountType';
    if(searchParams.has(accountTypeKey)){
        const accountType:AccountType = searchParams.get(accountTypeKey) as AccountType
        const {dropCbCredentials,dropCbToken} = utils({accountType})
        dropCbToken({accountType})
        dropCbCredentials({accountType})
    }
    return Response.redirect(request.nextUrl.origin);
}

export const POST = async(request:NextRequest,)=>{
    return login(request);
}

export const GET = async(request:NextRequest)=>{
    const { searchParams } = new URL(request.url)
    if(searchParams.has('action')){
        const action = searchParams.get('action');
        if(action == 'logout')
        return logout(request);

        if(action == 'refreshToken')
        return refreshTokens(request);
    } 
    return Response.redirect(request.nextUrl.origin);
}

