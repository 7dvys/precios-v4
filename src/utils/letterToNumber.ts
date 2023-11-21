export const letterToNumber = (colString:string)=>{
    if(parseInt(colString) || parseInt(colString) === 0)
    return Number(colString);

    colString = colString.toUpperCase();
    const codigoAscii = colString.charCodeAt(0);
    return codigoAscii - 65 + 1;
}
