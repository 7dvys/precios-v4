import { GetXlsxSheetFromSheetItemsInProductsParams } from "@/types/ListaUtilsTypes";
import { getXlsxSheetFromMatchesBetweenProductsAndSheet } from "@/utils/listas/getXlsxSheetFromMatchesBetweenProductsAndSheet";
import { NextRequest } from "next/server";

export const POST = async (request:NextRequest)=>{
    const params:GetXlsxSheetFromSheetItemsInProductsParams = await request.json()
    return Response.json(getXlsxSheetFromMatchesBetweenProductsAndSheet(params));
}