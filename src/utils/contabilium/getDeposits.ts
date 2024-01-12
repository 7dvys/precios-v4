import { getAccountDeposits } from "@/services/contabilium/accountDeposits";
import { Deposits, Tokens } from "@/types/Contabilium";

export const getDeposits = async ({tokens}:{tokens:Tokens}):Promise<Deposits> =>{
    const mainDeposits = getAccountDeposits({token:tokens.main});
    const secondaryDeposits = getAccountDeposits({token:tokens.secondary});

    const [mainDeposit,secondaryDeposit] = await Promise.all([mainDeposits,secondaryDeposits]);

    const main = mainDeposit.filter(deposit=>deposit.Activo) 
    const secondary = secondaryDeposit.filter(deposit=>deposit.Activo) 

    return {main,secondary};
}