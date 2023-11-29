import * as XLSX from 'xlsx';

export const getXlsxWorkBookFromFile = async (file:File)=>{
    if(!file)
    return ({error:'empty file'});

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    return workbook;
}