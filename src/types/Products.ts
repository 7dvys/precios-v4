import { AccountType } from "./Config";
import { Product } from "./Contabilium";

export type Products = {
    [accountType in AccountType]:Product[]
}

export type SerializedProducts = {
    [accountType in AccountType]:Record<string,Product>;
}

export type UnifiedProducts = (Product & {account:AccountType})[] 