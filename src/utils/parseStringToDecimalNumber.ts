export const parseStringToDecimalNumber = (str:string)=>{
    if(str === '')
    return false;
    
    const formatedString = str.replace(',','.');
    const newNumber = Number(formatedString);

    if(isNaN(newNumber))
    return false

    return newNumber;
}