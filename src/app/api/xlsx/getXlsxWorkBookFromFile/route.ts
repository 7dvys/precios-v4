import { getXlsxWorkBookFromFile } from "@/utils/xlsx/getXlsxWorkBookFromFile";
import { NextRequest } from "next/server";

export const POST = async (req:NextRequest)=>{
    const file = (await req.formData()).get('file') as File;
    return Response.json(await getXlsxWorkBookFromFile(file));
}