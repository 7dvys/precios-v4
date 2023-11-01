import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys";
import { AccountType, AccountTypeKey } from "@/types/Config";
import { CbToken } from "@/types/Contabilium";
import { cookies } from "next/headers";

const {userMainKey,passMainKey,userSecondaryKey,passSecondaryKey,cbTokenMainKey,cbTokenSecondaryKey} = CONTABILIUM_KEYS;

const getCookiesKeys = ({accountType}:{accountType:AccountType})=>{
    const userKey = accountType=='main'?userMainKey:userSecondaryKey;
    const passKey = accountType=='main'?passMainKey:passSecondaryKey;
    const cbTokenKey = accountType == 'main'?cbTokenMainKey:cbTokenSecondaryKey;
    return {userKey,passKey,cbTokenKey}
}

export const setDefaultAccountType = ()=>{
    const accountTypeKey:AccountTypeKey = 'accountType';
const defaultAccountType:AccountType = 'main';
cookies().set(accountTypeKey,defaultAccountType,{});
}

const utils = ({accountType}:{accountType:AccountType})=>{ 
    const cookiesStore = cookies();
    const {userKey,passKey,cbTokenKey} = getCookiesKeys({accountType}); 
    const isSetCbCredentials = cookiesStore.has(userKey) && cookiesStore.has(passKey);

    const isDuplicatedCbCredentials = ({ user, password }: { user: string; password: string }) => {
        const duplicatedCbCredentialsAccountType = (['main', 'secondary'] as AccountType[]).find((accountType) => {
            const { userKey, passKey } = getCookiesKeys({ accountType });
            const cookiesUser = cookiesStore.get(userKey)?.value as string|undefined
            const cookiesPass = cookiesStore.get(passKey)?.value as string|undefined
            const isSameUser = cookiesUser  === user;
            const isSamePass = cookiesPass === password;
            return isSameUser && isSamePass;            
        })
        return duplicatedCbCredentialsAccountType || false;
    }

    const setCbToken = ({token}:{token:CbToken})=>{
        const {access_token,expires_in} = token;
        cookies().set(cbTokenKey,access_token,{maxAge:expires_in,secure:true,httpOnly:true,})
    }

    const dropCbToken = ({accountType}:{accountType:AccountType})=>{
        const {cbTokenKey} = getCookiesKeys({accountType})
        cookies().delete(cbTokenKey)
    }
    
    const setCbCredentials = ({user,password}:{user:string,password:string})=>{
        cookies().set(userKey, user,{});
        cookies().set(passKey, password, {secure:true,httpOnly:true,});
    }

    const dropCbCredentials = ({accountType}:{accountType:AccountType})=>{
        const {userKey,passKey} = getCookiesKeys({accountType})
        cookies().delete(userKey)
        cookies().delete(passKey)
    }

    const resolveDuplicatedCbCredentials = ({user,password}:{user:string,password:string})=>{
        const duplicatedAccountType = isDuplicatedCbCredentials({user,password})
        if(duplicatedAccountType !== false){
            dropCbToken({accountType:duplicatedAccountType});
            dropCbCredentials({accountType:duplicatedAccountType});
        }
    }

    return {isDuplicatedCbCredentials,isSetCbCredentials,setCbToken,dropCbToken,setCbCredentials,dropCbCredentials,resolveDuplicatedCbCredentials}
}

export default utils;