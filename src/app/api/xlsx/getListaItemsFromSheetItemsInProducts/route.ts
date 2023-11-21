import { GetListaItemsFromSheetItemsInProductsParams, getListaItemsFromSheetItemsInProducts } from "@/utils/agregarUtils";
import { NextRequest } from "next/server";

export const POST = async (request:NextRequest)=>{
    const params:GetListaItemsFromSheetItemsInProductsParams = await request.json()
    return Response.json(getListaItemsFromSheetItemsInProducts(params));
}