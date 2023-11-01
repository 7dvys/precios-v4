import { isDate } from "./isDate";

export const localeDateStringToDate = (localeDateString:string)=>{
    const dateParts = localeDateString.split('/'); 

    if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Restar 1 al mes ya que los meses en JavaScript van de 0 a 11
        const year = parseInt(dateParts[2], 10);

        const date = new Date(year, month, day);
        return isDate(date)?date:false;
    } else {
        return false;
    }
}