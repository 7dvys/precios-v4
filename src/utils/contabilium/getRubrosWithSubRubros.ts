import { getAccountRubrosWithSubRubros } from "@/services/contabilium/accountRubrosWithSubRubros";
import { RubrosWithSubRubrosPerAccount, Tokens } from "@/types/Contabilium";

export const getRubrosWithSubRubros = async ({tokens}:{tokens:Tokens}):Promise<RubrosWithSubRubrosPerAccount> =>{
    const mainRubrosWithSubRubros = await getAccountRubrosWithSubRubros({token:tokens.cbTokenMain})
    const secondaryRubrosWithSubRubros = await getAccountRubrosWithSubRubros({token:tokens.cbTokenSecondary})
    return {main:mainRubrosWithSubRubros,secondary:secondaryRubrosWithSubRubros};
}