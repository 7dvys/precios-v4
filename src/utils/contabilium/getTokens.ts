import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys";
import { cookies } from "next/headers"

const {cbTokenMainKey,cbTokenSecondaryKey} = CONTABILIUM_KEYS

export const getTokensFromCookies = ()=>{
    let cbTokenMain = '',cbTokenSecondary = '';
    const cookiesStore = cookies();
    if(cookiesStore.has(cbTokenMainKey) && cookiesStore.has(cbTokenSecondaryKey)){
        cbTokenMain = cookiesStore.get(cbTokenMainKey)?.value as string;
        cbTokenSecondary = cookiesStore.get(cbTokenSecondaryKey)?.value as string;
    }
    return {cbTokenMain,cbTokenSecondary};
}