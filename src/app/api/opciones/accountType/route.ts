import { errorCodes } from "@/constants/opciones/notifications";
import { AccountType, AccountTypeKey } from "@/types/Config";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

const domain = `${process.env.HOST}:${process.env.PORT}`;
// config default values
export const GET = async (request:NextRequest)=>{
    const accountTypeKey:AccountTypeKey = 'accountType';
    const defaultAccountType:AccountType = 'main';
    cookies().set(accountTypeKey,defaultAccountType,{domain});
    return Response.redirect(request.nextUrl.origin);
}

export const POST = async (request:NextRequest)=>{
    const formData = await request.formData()
    const accountTypeKey:AccountTypeKey = 'accountType';
    let notification = '';

    if(formData.has(accountTypeKey)){
        const accountTypeValue = formData.get(accountTypeKey) as string
        if(accountTypeValue) {
            cookies().set(accountTypeKey,accountTypeValue,{domain});
            notification = errorCodes.accountTypeSuccess;
        }
    }

    return Response.redirect(request.nextUrl.origin+'/opciones/contabilium?notification='+ notification);
}