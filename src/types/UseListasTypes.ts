import { SheetInformation, XlsxSheet } from "./AgregarTypes";
import { AccountType } from "./Config";
import { Lista, Tag } from "./Listas"

export type UseListasProps = {
    initialLista?:Lista
}

export type SetNameVendorAndTypeParams = {
    name:string,
    vendor:string,
    vendorId:number,
    type:AccountType|'both',
}

export type SetNameVendorAndType = ({ name, vendor, vendorId }: SetNameVendorAndTypeParams) => void;

export type AddSheet = ({ xlsxSheet }: {
    xlsxSheet: XlsxSheet;
}) => void

export type RemoveSheet = ({ sheetInformation }: {
    sheetInformation: SheetInformation;
}) => void

export type AddTag = ({ tagId, tag }: {
    tagId: string;
    tag: Tag;
}) => void

export type RemoveTag = ({ tagId }: {
    tagId: string;
}) => void

export type RemoveListaItem = ({ codigo }: {
    codigo: string;
}) => void

export type RemoveListaItemSku = ({ codigo, sku, account }: {
    codigo: string;
    sku: string;
    account:AccountType
}) => void

export type AddListaItemSku = ({ codigo, newSku, account }: {
    codigo: string;
    newSku: string;
    account:AccountType
}) => void