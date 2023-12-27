import { LOCALHOST } from "@/constants/domain"
import { revalidateTag } from "next/cache"
import { NextRequest } from "next/server"

export const GET = (request:NextRequest)=>{
    revalidateTag('accountProducts')
    const searchParamListaId = request.nextUrl.searchParams.get('listaId');
    const urlListaIdIfExist = searchParamListaId !== null?`/${searchParamListaId}`:'';
    console.log(urlListaIdIfExist)
    
    return Response.redirect(request.nextUrl.origin+'/listas'+urlListaIdIfExist);
}