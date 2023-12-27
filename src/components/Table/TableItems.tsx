import tableStyles from '@/styles/tables.module.css';
import containerStyles from '@/styles/containers.module.css'
import { TableItem, TableItemsProps } from "@/types/TableTypes";
import { TableItemHeaderAction } from "./TableItemHeaderAction";
import { Fragment } from "react";
import { TableItemCheckbox } from "./TableItemCheckbox";

export const TableItems: React.FC<TableItemsProps> = ({ columns, filteredItems, setSelectedItems, selectedItems, groupFunctions }) => {
    const renderCheckboxes = groupFunctions !== undefined;
    const visibleColumns = columns.filter(({ visible }) => visible !== false).map(({ keyColumn }) => keyColumn);
    const isVisibleColumn = (keyColumn: string) => visibleColumns.some(visibleKeyColumn => keyColumn === visibleKeyColumn);

    const selectItem = ({item}:{item:TableItem})=>{
        const isChecked = selectedItems.some(itemId=>itemId===item.id);
        setSelectedItems(selectedItems=>{
            if(isChecked){
                const newSelectedItems = selectedItems.filter(itemId=>itemId!==item.id);
                return newSelectedItems;
            }
            else{
                return [...selectedItems,item.id];
            }
        })
    }

    const getIsChecked = ({item}:{item:TableItem})=>{
        const isChecked = selectedItems.some(itemId=>itemId===item.id);
        return isChecked;
    }

    if (filteredItems.length)
        return (
            <div className={`${containerStyles.container}`}>
                <table className={`${tableStyles.tableItems}`}>
                    <thead>
                        <tr>
                            {renderCheckboxes && <th className={tableStyles.checkBoxCol}><TableItemHeaderAction filteredItems={filteredItems} groupFunctions={groupFunctions} setSelectedItems={setSelectedItems} selectedItems={selectedItems} /></th>}
                            {columns.map(({ keyColumn, label }) =>
                                <Fragment key={keyColumn}>
                                    {isVisibleColumn(keyColumn) && <th>{label}</th>}
                                </Fragment>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item, index) => (
                            <Fragment key={index}>
                                <tr style={item.styles}>
                                    {renderCheckboxes &&
                                        <td className={tableStyles.checkBoxCol} key={'checkbox' + index}>
                                            <TableItemCheckbox item={item} selectItem={selectItem} isChecked={getIsChecked({item})} />
                                        </td>
                                    }

                                    {Object.entries(item).map(([key, value]) =>
                                        isVisibleColumn(key) && <td onClick={()=>{selectItem({item})}} key={key + index}>{((value === 'string' && (value as string).trim()) || value) as React.ReactNode}</td>
                                    )}
                                </tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

        )
    else
        return (
            <div className={containerStyles.container}>
                Sin elementos...
            </div>
        )
}

