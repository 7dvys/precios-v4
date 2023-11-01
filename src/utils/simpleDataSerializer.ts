type EncoderableObject = {
    [key:string]:string|number|(string|number)[];
}

type DecodedObject<PrevEncodedObjectType> = {
    [key in keyof PrevEncodedObjectType]:string[];
}

export const simpleDataSerializer = ()=>{
    const encoder = (object:EncoderableObject):string=>{
        return Object.entries(object).map(([key,value])=>(`${key}:${value}`)).join('\n')
    }

    const decoder = <PrevEncodedObjectType>(encodedObject:string):DecodedObject<PrevEncodedObjectType>|{}=>{
        const rows = encodedObject.split('\n');
        if(rows[0].length === 0)
        return {}

        return rows.reduce((acc,row)=>{
            const splitedRow = row.split(':');

            if(!splitedRow[0].trim() || splitedRow.length !== 2)
            return acc;
        
            const key = splitedRow[0].trim();
            const value = splitedRow[1].split(',').filter(value=>value.trim());
        
            acc[key]=value;
            return acc;
        },{} as Record<string,any>)
    }

    return {encoder,decoder}
}