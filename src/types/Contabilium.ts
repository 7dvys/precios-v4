export type CbUserKey = 'userMain'|'userSecondary';
export type CbPassKey = 'passMain'|'passSecondary';
export type CbTokenKey = 'tokenMain'|'tokenSecondary';
export type CbCredentials = {[key in CbUserKey|CbPassKey]:string}

export type CbToken = {
    access_token:string;
    token_type:'bearer';
    expires_in:number; // time in sec (24 hours)
    error?:string
}
