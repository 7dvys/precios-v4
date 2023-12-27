import { getAccountVendors } from "@/services/contabilium/accountVendors";
import { Tokens, Vendor } from "@/types/Contabilium";

export const getVendors = async ({tokens}:{tokens:Tokens}):Promise<Vendor[]> =>{
    const mainVendors:Vendor[] = await getAccountVendors({token:tokens.main});
    return mainVendors;
}
