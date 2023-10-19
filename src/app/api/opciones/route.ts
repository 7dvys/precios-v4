import { AccountType, AccountTypeKey } from "@/types/Config";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

// config default values
export const GET = async (request:NextRequest)=>{
    const accountTypeKey:AccountTypeKey = 'accountType';
    const defaultAccountType:AccountType = 'main';
    cookies().set(accountTypeKey,defaultAccountType);
    return Response.redirect(request.nextUrl.origin);
}

export const PUT = async (request:NextRequest)=>{
    const accountType:{AccountTypeKey:AccountType} = await request.json();
    const [accountTypeKey,accountTypeValue] = Object.entries(accountType)[0]
    cookies().set(accountTypeKey,accountTypeValue);
    return new Response(null,{status:200})
}