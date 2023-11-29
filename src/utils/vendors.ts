import { Vendor } from "@/types/Contabilium";
import { Option } from "@/types/FormFields";

export const getVendorsOptionList = ({vendors}:{vendors:Vendor[]}):Option[]=>
    vendors.map(({Id,NombreFantasia,RazonSocial})=>({value:Id.toString(),title:NombreFantasia||RazonSocial}))


export const getSerializedVendors = ({vendors}:{vendors:Vendor[]}) =>
    vendors.reduce((acc,vendor)=>{
        acc[vendor.Id]=vendor;
        return acc;
    },{} as Record<string,Vendor>)