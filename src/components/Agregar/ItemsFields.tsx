import { ItemsFieldsProps, XlsxListaItems } from "@/types/AgregarTypes";
import { Option } from "@/types/FormFields";
import { getXlsxWorkBookFromFileWithApi, getListaItemsFromSheetItemsInProductsWithApi } from "@/utils/agregarUtils";
import { CSSProperties, Dispatch, SetStateAction, useRef, useState } from "react";
import containerStyles from '@/styles/containers.module.css'
import { LabelWrapper } from "../LabelWrapper";
import { Options } from "../Options";


const sheetLabelStyles:CSSProperties = {
    padding:'0.4rem',
    flexGrow:0,
    flexShrink:0,
    border:'1px solid var(--grey-beige-0)',
    borderRadius:2,

}

type SheetInformation = {fileName:string,sheetName:string};
type SheetLabelProps = SheetInformation & {
    removeXlsxListaItems:(sheetInformation:SheetInformation)=>void
}

const SheetLabel:React.FC<SheetLabelProps> = ({fileName,sheetName,removeXlsxListaItems})=>{
    const title = `archivo: ${fileName}\nhoja: ${sheetName}`;
    return (
        <div onClick={()=>removeXlsxListaItems({fileName,sheetName})} title={title} style={sheetLabelStyles} className="flex-row flex-gap-l">
            {sheetName}
        </div>
    )
}

type SheetLabelsProps = {
    xlsxListaItemsList:XlsxListaItems[],
    setXlsxListaItemsList:Dispatch<SetStateAction<XlsxListaItems[]>>
}

const SheetLabels:React.FC<SheetLabelsProps> = ({xlsxListaItemsList,setXlsxListaItemsList})=>{
    const removeXlsxListaItems = (sheetInformation:SheetInformation)=>{
        const removeConfirmation = confirm('Esta seguro que desea borrar la hoja '+sheetInformation.sheetName);
        if(removeConfirmation)
        setXlsxListaItemsList(xlsxListaItemsList=>{
            const newXlsxListaItems = xlsxListaItemsList.filter(({sheetName,fileName})=>(sheetName !== sheetInformation.sheetName && fileName !== sheetInformation.fileName))
            return newXlsxListaItems;
        })  
    }
    return (
        <LabelWrapper labelText="Hojas acumuladas">
            {xlsxListaItemsList.map(({fileName,sheetName})=>SheetLabel({fileName,sheetName,removeXlsxListaItems}))}
        </LabelWrapper>
    )
}

export const ItemsFields:React.FC<ItemsFieldsProps> = ({setXlsxWorkbook,xlsxListaItemsList,xlsxSheetItems,xlsxWorkbook,setXlsxSheetItems,setXlsxListaItemsList,cotizaciones,products})=>{

    const [isLoading,setIsLoading] = useState<boolean>(false);
    const sheetNamesOptionList:Option[] = xlsxWorkbook.SheetNames.map(sheetName=>({value:sheetName}))
    const cotizacionesOptionList:Option[] = Object.entries(cotizaciones).map(([name,exchangeRate]:[string,number])=>({value:name,title:`${name} - ${exchangeRate}`}))
    
    const changeXlsxFileHandler = async (event:React.ChangeEvent<HTMLInputElement>)=>{
        cancelHandler()
        setIsLoading(true);
        const xlsxFile = (event.target.files as FileList)[0];
        const xlsxWorkBook = await getXlsxWorkBookFromFileWithApi(xlsxFile);
        xlsxWorkBook && setXlsxWorkbook(xlsxWorkBook);
        setIsLoading(false);
    }   

    const getFieldsValues = ()=>{
        const sheetName = (xlsxSheetRef.current as HTMLSelectElement).value
        const colCod = (colCodRef.current as HTMLInputElement).value
        const colCost = (colCostoRef.current as HTMLInputElement).value
        const colTitle = (colTitleRef.current as HTMLInputElement).value
        const colIva = (colIvaRef.current as HTMLInputElement).value
        const colProfit = (colProfitRef.current as HTMLInputElement).value
        const colExchRate = (colExchRateRef.current as HTMLInputElement).value
        const colTags = (colTagsRef.current as HTMLInputElement).value

        const defaultIva = Number((defaultIvaRef.current as HTMLInputElement).value)
        const defaultProfit = Number((defaultRentabilidadRef.current as HTMLInputElement).value)
        const defaultExchRate = (defaultCotizacionRef.current as HTMLSelectElement).value 

        const overWrite = (overWriteRef.current as HTMLSelectElement).value === 'true';

        return {sheetName,colCod,colCost,colTitle,colIva,colProfit,colExchRate,colTags,defaultIva,defaultProfit,defaultExchRate,overWrite}
    }

    const clearFieldsValues = ()=>{
        (colCodRef.current as HTMLInputElement).value = '';
        (colCostoRef.current as HTMLInputElement).value = '';
        (colTitleRef.current as HTMLInputElement).value = '';
        (colIvaRef.current as HTMLInputElement).value = '';
        (colProfitRef.current as HTMLInputElement).value = '';
        (colExchRateRef.current as HTMLInputElement).value = '';
        (colTagsRef.current as HTMLInputElement).value = '';

        (defaultIvaRef.current as HTMLInputElement).value = '';
        (defaultRentabilidadRef.current as HTMLInputElement).value = '';
        (defaultCotizacionRef.current as HTMLSelectElement).value = 'none'; 

        (overWriteRef.current as HTMLSelectElement).value = 'true';
    }

    const confirmHandler = async ()=>{
        const fieldsValues = getFieldsValues()
        const {colCod,colCost} = fieldsValues;
        if(!colCod || !colCost)
        return alert('Debes completar las columnas obligatorias.')
    
        setIsLoading(true);

        const xlsxSheetItems = await getListaItemsFromSheetItemsInProductsWithApi({xlsxListaItemsList,xlsxWorkbook,products,...fieldsValues,defaultExchRate:fieldsValues.defaultExchRate==='none'?'peso':fieldsValues.defaultExchRate})
        const xlsxSheetItemsDoesntHaveItems = xlsxSheetItems.length === 0;
        if(xlsxSheetItemsDoesntHaveItems){
            alert('Esta hoja no tiene articulos.')
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        setXlsxSheetItems(xlsxSheetItems);
    }

    const cancelHandler = ()=>{
        clearFieldsValues();
        setXlsxSheetItems([]);
    }

    const agregarHandler = ()=>{
        const fileName = ((xlsxFileRef.current as HTMLInputElement).files as FileList)[0].name;
        const sheetName = (xlsxSheetRef.current as HTMLSelectElement).value

        if(fileName && sheetName && xlsxSheetItems.length){
            setXlsxListaItemsList(xlsxListaItemsList=>{
                const xlsxListaItemsWithoutCurrentXlsxSheet = xlsxListaItemsList.filter(xlsxListaItems=>{
                    const isSameFile = fileName === xlsxListaItems.fileName;
                    const isSameSheet = sheetName === xlsxListaItems.sheetName;
                    return !(isSameFile && isSameSheet);
                })
                const newXlsxListaItems:XlsxListaItems = {fileName,sheetName,items:xlsxSheetItems}

                return [...xlsxListaItemsWithoutCurrentXlsxSheet,newXlsxListaItems];
            })
            cancelHandler();
        }
    }

    const xlsxFileRef = useRef<HTMLInputElement>(null);
    const xlsxSheetRef = useRef<HTMLSelectElement>(null);
    const colCodRef = useRef<HTMLInputElement>(null);
    const colCostoRef = useRef<HTMLInputElement>(null);
    const colTitleRef = useRef<HTMLInputElement>(null);
    const colIvaRef = useRef<HTMLInputElement>(null);
    const colProfitRef = useRef<HTMLInputElement>(null);
    const colExchRateRef = useRef<HTMLInputElement>(null);
    const colTagsRef = useRef<HTMLInputElement>(null);
    const defaultIvaRef = useRef<HTMLInputElement>(null);
    const defaultRentabilidadRef = useRef<HTMLInputElement>(null);
    const defaultCotizacionRef = useRef<HTMLSelectElement>(null);
    const overWriteRef = useRef<HTMLSelectElement>(null);
    
    return (
        <div className={`${containerStyles.container} flex-column flex-gap-xl`}>
            <div className='flex-row flex-space-between'>
                <div className='flex-row flex-gap-s flex-wrap'>
                    <LabelWrapper labelText='Archivo'>
                        <input ref={xlsxFileRef} disabled={isLoading} onChange={changeXlsxFileHandler} type="file" accept='.xlsx,.xls,.csv,.ods' name="xlsxWorkbook" id="xlsxWorkbook" />
                    </LabelWrapper>
                    <LabelWrapper labelText='Hoja'>
                        <select ref={xlsxSheetRef} disabled={isLoading} name='xlsxSheets' id="xlsxSheets"><Options optionList={sheetNamesOptionList}/></select>
                    </LabelWrapper>
                    <LabelWrapper labelText="Sobrescribir">
                        <select disabled={isLoading} ref={overWriteRef} name="overWrite">
                            <option value="true">si</option>
                            <option value="false">no</option>
                        </select>
                    </LabelWrapper>
                    {xlsxListaItemsList.length>0 && <SheetLabels xlsxListaItemsList={xlsxListaItemsList} setXlsxListaItemsList={setXlsxListaItemsList}/>}
                </div>
                
                <div className='flex-row flex-gap-s'>
                    <input disabled={isLoading} onClick={confirmHandler} type="submit" value="confirmar" />
                    {xlsxSheetItems.length > 0 && <input disabled={isLoading} onClick={cancelHandler} type="submit" value="cancelar" />}
                    {xlsxSheetItems.length > 0 && <input onClick={agregarHandler} disabled={isLoading} type="submit" value="agregar" />}
                </div>

            </div>
            <div className='flex-row flex-gap-m flex-wrap'>
                <LabelWrapper labelText='Columnas Obligatorias'>
                    <div className='flex-row flex-gap-s'>
                        <input disabled={isLoading} ref={colCodRef}  type="text" placeholder='codigo' />
                        <input disabled={isLoading} ref={colCostoRef} type="text" placeholder='costo' />
                    </div>
                </LabelWrapper>
                <LabelWrapper labelText='Columnas Opcionales'>
                    <div className='flex-row flex-gap-s'>
                        <input disabled={isLoading} ref={colTitleRef} type="text" placeholder='titulo' />
                        <input disabled={isLoading} ref={colIvaRef} type="text" placeholder='iva' />
                        <input disabled={isLoading} ref={colProfitRef} type="text" placeholder='rentabilidad'/>
                        <input disabled={isLoading} ref={colExchRateRef} type="text" placeholder='cotizacion'/>
                        <input disabled={isLoading} ref={colTagsRef} type="text" placeholder='tags' />
                    </div>
                </LabelWrapper>
            </div>
            <div className='flex-row flex-gap-m flex-space-between flex-wrap'>
                <LabelWrapper labelText='Valores por defecto'>
                    <div className='flex-row flex-gap-s'>
                        <input disabled={isLoading} ref={defaultIvaRef}  type="number" min={1} placeholder='iva' required={true}/>
                        <input disabled={isLoading} ref={defaultRentabilidadRef} type="number" min={1} placeholder='rentabilidad'/>
                        <select disabled={isLoading}  ref={defaultCotizacionRef} name="cotizacion">
                            <Options optionList={cotizacionesOptionList} placeholder='cotizacion'/>
                        </select>
                    </div>
                </LabelWrapper>
            </div>
        </div>
    )
}