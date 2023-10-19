export type CbUserKey = 'userMain'|'userSecondary';
export type CbPassKey = 'passMain'|'passSecondary';
export type CbTokenKey = 'tokenMain'|'tokenSecondary';
export type CbCredentials = {[key in CbUserKey|CbPassKey]:string}
