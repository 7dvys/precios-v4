import { Vendor } from "@/types/Contabilium";
import { Products } from "@/types/Products";
import { fixProducts } from "@/utils/listas/fixProducts";
import { NextRequest } from "next/server";

export const POST = async (request:NextRequest)=>{
    const {products,vendors}:{products:Products,vendors:Vendor[]} = await request.json()
    return Response.json(fixProducts({products,vendors}));
}