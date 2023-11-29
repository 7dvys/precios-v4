import { sheetLabelStyles } from "@/styles/SheetLabelStyles";
import { XlsxSheet } from "@/types/AgregarTypes";
import { Dispatch, SetStateAction } from "react";
import { LabelWrapper } from "../LabelWrapper";
import { RemoveSheet } from "@/types/UseListasTypes";

type SheetInformation = {fileName:string,sheetName:string};

type SheetLabelProps = SheetInformation & {
    removeSheetHandler:(sheetInformation:SheetInformation)=>void
}

const SheetLabel:React.FC<SheetLabelProps> = ({fileName,sheetName,removeSheetHandler})=>{
    const title = `archivo: ${fileName}\nhoja: ${sheetName}`;
    return (
        <div onClick={()=>removeSheetHandler({fileName,sheetName})} title={title} style={sheetLabelStyles} className="flex-row flex-gap-l">
            {sheetName}
        </div>
    )
}

type SheetLabelsProps = {
    xlsxSheets:XlsxSheet[],
    removeSheet:RemoveSheet;
}

export const SheetLabels:React.FC<SheetLabelsProps> = ({xlsxSheets,removeSheet})=>{

    const removeSheetHandler = (sheetInformation:SheetInformation)=>{
        const removeConfirmation = confirm('Esta seguro que desea borrar la hoja '+sheetInformation.sheetName);
        if(removeConfirmation)
        removeSheet({sheetInformation}) 
    }
    
    return (
        <LabelWrapper labelText="Hojas acumuladas">
            {xlsxSheets.map(({fileName,sheetName})=>SheetLabel({fileName,sheetName,removeSheetHandler}))}
        </LabelWrapper>
    )
}