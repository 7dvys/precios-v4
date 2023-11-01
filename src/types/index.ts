import { AccountType } from "./Config";
import { Product } from "./Contabilium";

export type Products = {
    [accountType in AccountType]:Product[]
}

