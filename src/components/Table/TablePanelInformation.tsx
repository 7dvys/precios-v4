import { TablePanelInformationProps } from "@/types/TableTypes";

export const TablePanelInformation:React.FC<TablePanelInformationProps> = ({information})=>{
    if(information)
    return (
        <div className="flex-row">
            {Object.entries(information).map(([key,value],index)=>{
                return <span key={index}>{key}:{value}</span>
            })}
        </div>
    )
    else 
    return null;
}