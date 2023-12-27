import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys";
import { Tokens } from "@/types/Contabilium";
import { cookies } from "next/headers"

const {cbTokenMainKey,cbTokenSecondaryKey} = CONTABILIUM_KEYS

export const getTokensFromCookies = ():Tokens=>{
    let main = '',secondary = '';
    const cookiesStore = cookies();
    if(cookiesStore.has(cbTokenMainKey) && cookiesStore.has(cbTokenSecondaryKey)){
        main = cookiesStore.get(cbTokenMainKey)?.value as string;
        secondary = cookiesStore.get(cbTokenSecondaryKey)?.value as string;
    }
    return {main,secondary};
}