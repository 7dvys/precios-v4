import * as XLSX from 'xlsx';
import { ItemsFieldsProps } from "@/types/AgregarTypes";
import { Option } from "@/types/FormFields";
import { useRef, useState } from "react";
import containerStyles from '@/styles/containers.module.css'
import { LabelWrapper } from "../LabelWrapper";
import { Options } from "../Options";
import { getXlsxWorkBookFromFileWithApi } from '@/utils/xlsx/getXlsxWorkBookFromFileWithApi';
import { getXlsxSheetFromMatchesBetweenProductsAndSheetWithApi } from '@/utils/listas/getXlsxSheetFromMatchesBetweenProductsAndSheetWithApi';
import { SheetLabels } from './SheetLabels';

export const ItemsFields:React.FC<ItemsFieldsProps> = ({tmpXlsxSheet,finishListaFunc,addTmpXlsxSheetToLista,removeTmpXlsxSheet,setTmpXlsxSheet,removeSheet,cotizaciones,products,xlsxSheets})=>{
    const [xlsxWorkbook,setXlsxWorkbook] = useState<XLSX.WorkBook>({SheetNames:['none']} as XLSX.WorkBook);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const changeXlsxFileHandler = async (event:React.ChangeEvent<HTMLInputElement>)=>{
        cancelSheet();
        setIsLoading(true);
        const xlsxFile = (event.target.files as FileList)[0];
        const xlsxWorkBook = await getXlsxWorkBookFromFileWithApi(xlsxFile);
        xlsxWorkBook && setXlsxWorkbook(xlsxWorkBook);
        setIsLoading(false);
    }   

    const getFieldsValues = ()=>{
        const fileName = (xlsxFileRef.current as HTMLInputElement).value;
        const sheetName = (xlsxSheetRef.current as HTMLSelectElement).value;
        const colCod = (colCodRef.current as HTMLInputElement).value;
        const colCost = (colCostoRef.current as HTMLInputElement).value;
        const colTitle = (colTitleRef.current as HTMLInputElement).value;
        const colIva = (colIvaRef.current as HTMLInputElement).value;
        const colProfit = (colProfitRef.current as HTMLInputElement).value;
        const colExchRate = (colExchRateRef.current as HTMLInputElement).value;
        const colTags = (colTagsRef.current as HTMLInputElement).value;

        const defaultIva = Number((defaultIvaRef.current as HTMLInputElement).value)
        const defaultProfit = Number((defaultRentabilidadRef.current as HTMLInputElement).value)
        const defaultExchRate = (defaultCotizacionRef.current as HTMLSelectElement).value 

        const overWrite = (overWriteRef.current as HTMLSelectElement).value === 'true';
        const addNewItems = (addNewItemsRef.current as HTMLSelectElement).value === 'true';

        return {fileName,addNewItems,sheetName,colCod,colCost,colTitle,colIva,colProfit,colExchRate,colTags,defaultIva,defaultProfit,defaultExchRate,overWrite}
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
        (addNewItemsRef.current as HTMLSelectElement).value = 'true';
    }

    const confirmHandler = async ()=>{
        const fieldsValues = getFieldsValues()
        const {colCod,colCost,fileName,sheetName,overWrite,addNewItems} = fieldsValues;

        if(!colCod || !colCost)
        return alert('Debes completar las columnas obligatorias.')    

        if(!overWrite && !addNewItems)
        return removeTmpXlsxSheet();
    
        setIsLoading(true);
        const xlsxSheetItems = await getXlsxSheetFromMatchesBetweenProductsAndSheetWithApi({xlsxSheets,xlsxWorkbook,products,...fieldsValues,defaultExchRate:fieldsValues.defaultExchRate==='none'?'peso':fieldsValues.defaultExchRate})
        if(xlsxSheetItems === false)
        return setIsLoading(false);

        const xlsxSheetItemsDoesntHaveItems = xlsxSheetItems.length === 0;
        if(xlsxSheetItemsDoesntHaveItems){
            alert('Esta hoja no tiene articulos.')
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        setTmpXlsxSheet({sheetName,fileName,items:xlsxSheetItems});
    }

    const addSheetHandler = ()=>{
        addTmpXlsxSheetToLista();
        cancelSheet();    
    }

    const cancelSheet = ()=>{
        clearFieldsValues();
        removeTmpXlsxSheet();
    }

    const saveListaHandler = ()=>{
        if(tmpXlsxSheet.items.length > 0)
        return alert('No puedes guardar la lista si tienes una hoja en progreso.');

        if(confirm('Estas seguro que quieres guardar esta lista?'))
        finishListaFunc();
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
    const addNewItemsRef = useRef<HTMLSelectElement>(null);

    const sheetNamesOptionList:Option[] = xlsxWorkbook.SheetNames.map(sheetName=>({value:sheetName}))
    const cotizacionesOptionList:Option[] = Object.entries(cotizaciones).map(([name,exchangeRate]:[string,number])=>({value:name,title:`${name} - ${exchangeRate}`}))
    
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
                    <LabelWrapper labelText='Agregar Items'>
                        <select ref={addNewItemsRef} disabled={isLoading} name="addNewItems">
                            <option value="true">si</option>
                            <option value="false">no</option>
                        </select>
                    </LabelWrapper>
                    {xlsxSheets.length>0 && <SheetLabels xlsxSheets={xlsxSheets} removeSheet={removeSheet}/>}
                </div>
                
                <div className='flex-row flex-gap-s'>
                    {tmpXlsxSheet.items.length > 0 && <input onClick={addSheetHandler} disabled={isLoading} type="submit" value="agregar" />}
                    {tmpXlsxSheet.items.length > 0 && <input disabled={isLoading} onClick={cancelSheet} type="submit" value="cancelar" />}
                    <input disabled={isLoading} onClick={confirmHandler} type="submit" value="confirmar" />
                    <input disabled={isLoading} onClick={saveListaHandler} type="submit" value="guardar lista" />
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