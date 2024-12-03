import { Fetch_Grid_Data, Grid_Add, Grid_Edit, Grid_Delete, Batch_Save, Filter_Dialog_Data, Drag_Drop } from './action';
import { DataManager, Query, DataUtil, Predicate, DataResult, QueryOptions } from '@syncfusion/ej2-data';
import { BatchChanges, DataSourceChangedEventArgs, DataStateChangeEventArgs, FilterEventArgs, FilterSearchBeginEventArgs, LazyLoadGroupArgs, Sorts } from '@syncfusion/ej2-react-grids';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { GridInitialState } from '../grid-data';
import { KeyDataType, Orders } from '../App';

const initialState: ReducerState = {
    data: GridInitialState.dataSource,
    error: false,
    result: [],
    count: 0,
}

const applyFiltering = (query: Query, filter: QueryOptions[]) => {
    for (let i: number = 0; i < filter.length; i++) {
        const { fn, e } = filter[i];
        if (fn === 'onWhere') {
            query.where(e as Predicate);
        }
    }
}

const applySearching = (query: Query, search: QueryOptions[]) => {
    for (let i: number = 0; i < search.length; i++) {
        const { fn, e } = search[i];
        if (fn === 'onSearch') {
            query.search((e as QueryOptions).searchKey as string | number | boolean, (e as QueryOptions).fieldNames);
        }
    }
}

const applySorting = (query: Query, sort: Sorts[]) => {
    for (let i: number = 0; i < sort.length; i++) {
        const { name, direction } = sort[i];
        query.sortBy(name as string, direction);
    }
}

const applyPage = (query: Query, page: DataStateChangeEventArgs) => {
    if (page.take && page.skip) {
        const pageSkip = page.skip / page.take + 1;
        const pageTake = page.take;
        query.page(pageSkip, pageTake);
    } else if (page.skip === 0 && page.take) {
        query.page(1, page.take);
    }
}

const applyGrouping = (query: Query, group: string[]) => {
    for (let i: number = 0; i < group.length; i++) {
        query.group(group[i]);
    }
}

const applyLazyLoad = (query: Query, payload: DataStateChangeEventArgs) => {
    if (payload.isLazyLoad) {
        query.lazyLoad.push({ key: 'isLazyLoad', value: true });
        if (payload.onDemandGroupInfo) {
            query.lazyLoad.push({
                key: 'onDemandGroupInfo',
                value: (payload.action as LazyLoadGroupArgs).lazyLoadQuery as Object,
            });
        }
    }
}

const reducer = (state: ReducerState = initialState, action: Fetch) => {
    const dataSource: Object[] = [...initialState.data as Object[]];
    const gridData: DataManager = new DataManager(dataSource);
    let query: Query = new Query();
    switch (action.type) {
        case Filter_Dialog_Data: {
            let data: Object[] = dataSource;
            const fetchAction: FilterSearchBeginEventArgs = (action.payload as DataStateChangeEventArgs).action as FilterSearchBeginEventArgs;
            if (fetchAction.requestType === 'filterSearchBegin' && fetchAction.value) {
                query = new Query();
                query.search(fetchAction.value as string | number | boolean, fetchAction.query.distincts[0],
                    typeof fetchAction.value === 'number' ? 'equal' : fetchAction.operator, true);
                data = new DataManager(data).executeLocal(query);
            }
            data = DataUtil.distinct(data, fetchAction.query.distincts[0], true);
            query = new Query();
            query.page(1, fetchAction.filterChoiceCount);
            query.isCountRequired = true;
            const currentResult: DataResult = new DataManager(data).executeLocal(query) as unknown as DataResult;
            return {
                ...state,
                action: fetchAction,
                data: { result: currentResult.result, count: currentResult.count },
            };
        }
        case Drag_Drop: {
            const { fromIndex, toIndex }: DragDrop = action.payload as DragDrop;
            const data: Object[] = [...dataSource];
            const [movedItem]: Object[] = data.splice(fromIndex, 1);
            data.splice(toIndex, 0, movedItem);
            initialState.data = [...data];
            return {
                ...state,
                data: { result: initialState.data, count: data.length },
            };
        }
        case Fetch_Grid_Data: {
            const fetchPayload: DataStateChangeEventArgs = action.payload as DataStateChangeEventArgs;
            if (fetchPayload.where || (fetchPayload.action as FilterEventArgs).requestType === "stringfilterrequest") {
                applyFiltering(query, action.gridQuery.queries);
            }
            if (fetchPayload.search) {
                applySearching(query, action.gridQuery.queries);
            }
            query.aggregate('min', 'Freight');
            query.aggregate('max', 'Freight');
            query.aggregate('sum', 'Freight');
            if (!isNullOrUndefined(fetchPayload.sorted)) {
                applySorting(query, fetchPayload.sorted as Sorts[]);
            }
            applyLazyLoad(query, fetchPayload);
            applyPage(query, fetchPayload);
            if (!isNullOrUndefined(fetchPayload.group)) {
                applyGrouping(query, fetchPayload.group as string[]);
            }
            if (fetchPayload.requiresCounts) {
                query.isCountRequired = true;
            }
            const currentResult: DataResult = new DataManager(dataSource).executeLocal(query) as unknown as DataResult;
            return {
                ...state,
                action: null,
                data: {
                    result: currentResult.result, count: currentResult.count,
                    aggregates: {
                        'Freight - sum': (currentResult.aggregates as KeyDataType)['Freight - sum'],
                        'Freight - max': (currentResult.aggregates as KeyDataType)['Freight - max'],
                        'Freight - min': (currentResult.aggregates as KeyDataType)['Freight - min']
                    },
                },
            };
        }
        case Grid_Add:
        case Grid_Edit:
        case Grid_Delete: {
            const fetchPayload: DataSourceChangedEventArgs = action.payload as DataSourceChangedEventArgs;
            const fetchDataState: DataStateChangeEventArgs = fetchPayload.state as DataStateChangeEventArgs;
            if (action.type === Grid_Add) {
                gridData.insert(fetchPayload.data as Orders, '', undefined, 0);
            } else if (action.type === Grid_Edit) {
                gridData.update('OrderID', fetchPayload.data as Orders);
            } else if (action.type === Grid_Delete) {
                gridData.remove('OrderID', { OrderID: (fetchPayload.data as Orders[])[0].OrderID });
            }
            const updatedData: Object[] = gridData.executeLocal(new Query());
            initialState.data = [...updatedData];
            const count: number = updatedData.length;
            const result: Object[] = new DataManager(updatedData).executeLocal(action.gridQuery);
            const currentPageData: Object[] = new DataManager(result).executeLocal(new Query().skip(fetchDataState.skip as number).take(fetchDataState.take as number));
            return ({
                action: null,
                data: { result: currentPageData, count: count }
            });
        }
        case Batch_Save: {
            const fetchChanges: BatchChanges = (action.payload as DataSourceChangedEventArgs).changes as BatchChanges;
            if (fetchChanges.changedRecords && fetchChanges.changedRecords.length > 0) {
                fetchChanges.changedRecords.forEach((record: Object) => {
                    gridData.update('OrderID', record);
                });
            }
            if (fetchChanges.addedRecords && fetchChanges.addedRecords.length > 0) {
                fetchChanges.addedRecords.forEach((record: Object) => {
                    gridData.insert(record, '', undefined, 0);
                });
            }
            if (fetchChanges.deletedRecords && fetchChanges.deletedRecords.length > 0) {
                fetchChanges.deletedRecords.forEach((record: Object) => {
                    gridData.remove('OrderID', { OrderID: (record as Orders).OrderID });
                });
            }
            const updatedData: Object[] = gridData.executeLocal(new Query());
            initialState.data = [...updatedData];
            const count: number = updatedData.length;
            const result: Object[] = new DataManager(updatedData).executeLocal(action.gridQuery);
            return {
                action: null,
                data: { result: result, count: count }
            };
        }
        default: {
            query.page(1, GridInitialState.pageSettings?.pageSize as number);
            query.aggregate('min', 'Freight');
            query.aggregate('max', 'Freight');
            query.aggregate('sum', 'Freight');
            query.isCountRequired = true;
            const currentResult: DataResult = new DataManager(dataSource).executeLocal(query) as unknown as DataResult;
            return {
                ...state,
                action: null,
                data: { result: currentResult.result, count: currentResult.count },
            };
        }
    }
};

export default reducer;

interface ReducerState {
    data: Object | DataManager | DataResult | undefined;
    error: boolean;
    result: Object[];
    count: number;
}

interface Fetch {
    type: string;
    payload: DataStateChangeEventArgs | DataSourceChangedEventArgs | null | DragDrop;
    gridQuery: Query;
}

interface DragDrop {
    fromIndex: number;
    toIndex: number;
    page: SkipTake;
}

export interface SkipTake { skip: number, take: number }
