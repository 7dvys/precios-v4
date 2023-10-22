import { CONTABILIUM_KEYS } from "@/constants/contabilium/cookiesKeys"
import { AccountType, AccountTypeKey } from "@/types/Config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"

const {userMain,passMain,userSecondary,passSecondary} = CONTABILIUM_KEYS;

export const GET = async(request:NextRequest)=>{
    return Response.redirect(request.nextUrl.origin)
}

// save 
export const POST = async(request:NextRequest)=>{
    const formData = await request.formData()
    const accountTypeKey:AccountTypeKey = 'accountType';

    if(formData.has(accountTypeKey)){
        const accountType:AccountType = formData.get(accountTypeKey) as AccountType;
        const userKey = accountType == 'main'?userMain:userSecondary;
        const user = formData.get(userKey) as string;

        const passKey = accountType == 'main'?passMain:passSecondary;
        const pass = formData.get(passKey) as string;

        cookies().set(userKey,user)
        cookies().set(passKey,pass)

        console.log(cookies().getAll())

        return Response.json({},{status:200});
    }

    else
    return Response.redirect(request.nextUrl.origin)

    
}