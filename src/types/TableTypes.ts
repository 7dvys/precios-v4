import { CSSProperties, Dispatch, RefObject, SetStateAction } from "react";
import { Option } from "./FormFields";
import { AccountType } from "./Config";

// Tipos relacionados con TablePanel
export type TableColumn = {
  keyColumn: string;
  label: string;
  searchable: boolean;
  filterable: boolean;
  visible?:boolean;
};

export type TableItem = {
  [key: string]: React.ReactNode | (string|number)[] | CSSProperties;
} & { id: number,styles?:CSSProperties };

export type ItemsDictionary = Record<number, TableItemIdentifier>;

export type TableItemIdentifier = {
  codigo:string,
  sku:string|null
  account:AccountType|null
}

export type TableGroupFunction = {
  label: string;
  functionHandler: (selectedItems:number[])=> void;
};

export type TablePanelInformation = {
  [key: string]: string | number;
};

export type Filter = {
  keyColumn: string;
  label:string;
  values: Option[];
};

export type TablePanelFiltersProps = {
  filters: Filter[];
  filtersRef: RefObject<HTMLDivElement>;
};

export type TablePanelProps = TablePanelInformationProps & {
  setFilteredItems: Dispatch<SetStateAction<TableItem[]>>;
  filteredItems:TableItem[]
  columns: TableColumn[];
  items: TableItem[];
};

export type TablePanelSearchPros = {
  searchRef: RefObject<HTMLInputElement>;
};

export type TablePanelPaginationProps = {
  pages: number;
  paginationRef: RefObject<HTMLInputElement>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
};

export type TablePanelInformationProps = {
  information?: TablePanelInformation;
};

// Tipos relacionados con TableItems
export type TableItemsProps = SelectedItems & {
  columns: TableColumn[];
  items: TableItem[];
  groupFunctions?: TableGroupFunction[];
};
 
export type TableItemsHeaderCheckbox = SelectedItems & {groupFunctions?: TableGroupFunction[]}

export type TableItemCheckboxProps = SelectedItems & {
  item: TableItem;
};

export type SelectedItems = {
  selectedItems: number[];
  setSelectedItems: Dispatch<SetStateAction<number[]>>;
};

// Propiedades compartidas
export type TableProps = {
  groupFunctions?: TableGroupFunction[];
  customStyles?: string;
  panelInformation?: TablePanelInformation;
} & Omit<TableItemsProps, "setSelectedItems" | "selectedItems">;
