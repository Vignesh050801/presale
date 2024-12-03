import { Query } from "@syncfusion/ej2-data";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { DataSourceChangedEventArgs, DataStateChangeEventArgs } from "@syncfusion/ej2-react-grids";
import { SkipTake } from "./reducer";
export const Fetch_Grid_Data = "Fetch_Grid_Data";
export const Grid_Add = "Grid_Add";
export const Grid_Edit = "Grid_Edit";
export const Grid_Delete = "Grid_Delete";
export const Batch_Save = "Batch_Save";
export const Filter_Dialog_Data = "Filter_Dialog_Data";
export const Drag_Drop = "Drag_Drop";

export const fetchGridData: Function = (state?: DataStateChangeEventArgs | null, query?: Query) => ({
    type: !isNullOrUndefined(state) ? "Fetch_Grid_Data" : "",
    payload: state,
    gridQuery: query
});

export const filterDialogData: Function = (state?: DataStateChangeEventArgs, query?: Query) => ({
    type: "Filter_Dialog_Data",
    payload: state,
    gridQuery: query
});

export const dragDropData: Function = (fromIndex: number, toIndex: number, page: SkipTake) => ({
    type: "Drag_Drop",
    payload: { fromIndex, toIndex, page }
});

export const addRow: Function = (state: DataSourceChangedEventArgs, query: Query) => ({
    type: "Grid_Add",
    payload: state,
    gridQuery: query
});

export const updateRow: Function = (state: DataSourceChangedEventArgs, query: Query) => ({
    type: "Grid_Edit",
    payload: state,
    gridQuery: query
});

export const deleteRow: Function = (state: DataSourceChangedEventArgs, query: Query) => ({
    type: "Grid_Delete",
    payload: state,
    gridQuery: query
});

export const batchAction: Function = (state: DataSourceChangedEventArgs, query: Query) => ({
    type: "Batch_Save",
    payload: state,
    gridQuery: query
});
