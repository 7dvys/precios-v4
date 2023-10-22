import { CbCredentials } from "./Contabilium";
import { AccountTypeKey } from "./Config";

export type CookiesStore = {
    [key in keyof CbCredentials | AccountTypeKey]:key;
}

export type CbCredentialsKeys = (keyof CbCredentials)[]