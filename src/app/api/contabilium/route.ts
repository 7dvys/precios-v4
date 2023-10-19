import { CbCredentials } from "@/types/Contabilium";
import { NextResponse, type NextRequest } from "next/server";



export const POST = async (request:NextRequest)=>{
    const cbCredentials:CbCredentials = await request.json();
    return new Response(null,{status:200})
}