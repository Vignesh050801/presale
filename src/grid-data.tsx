import { createLazyLoadData,  lazyLoadData,createlazyLoadDataHierchy,lazyLoadDataHierchy } from './datasource';
import { GridModel } from '@syncfusion/ej2-react-grids'

createLazyLoadData();

createlazyLoadDataHierchy()

export const GridInitialState: GridModel  = {
    dataSource:  lazyLoadData,
    pageSettings: { pageSize: 50},

};

export const GridInitialState2: GridModel  = {
    dataSource:  lazyLoadDataHierchy,
    pageSettings: { pageSize: 12 },

};