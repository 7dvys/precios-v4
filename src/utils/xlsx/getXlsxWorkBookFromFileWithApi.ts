import { LOCALHOST } from '@/constants/domain';
import * as XLSX from 'xlsx';
export const getXlsxWorkBookFromFileWithApi = async (file:File):Promise<(XLSX.WorkBook|false)> =>{
    if(!file)
    return false;

    const data = new FormData();
    data.append('file',file);

    const endpoint = LOCALHOST+'/api/xlsx/getXlsxWorkBookFromFile';
    const config:RequestInit = {
        method:'POST',
        body:data
    }

    const xlsxWorkbookRequest = await fetch(endpoint,config);

    if(!xlsxWorkbookRequest.ok)
    return false;

    const xlsxWorkbookJson = await xlsxWorkbookRequest.json();

    if(xlsxWorkbookJson.error)
    return false;

    return xlsxWorkbookJson
}