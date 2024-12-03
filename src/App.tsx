import React, { useEffect, useRef, useState, useMemo } from 'react';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import {
  GridComponent, Inject, ColumnMenu, ColumnChooser, RowDD, Freeze,
  InfiniteScroll, CommandColumn, DetailRow, ContextMenu, VirtualScroll,
  DataStateChangeEventArgs, Filter, Search, LazyLoadGroup, Reorder, Resize, Sort, PdfExport,
  ExcelExport, Edit, Page, Toolbar, Group, ColumnsDirective, ColumnDirective,
  ContextMenuItem, EditMode, FilterType, DataSourceChangedEventArgs, GridModel,
  ToolbarItem,
  ContextMenuItemModel,
  EditSettingsModel,
  GroupSettingsModel,
  ColumnModel,
  AddEventArgs,
  QueryCellInfoEventArgs,
  ContextMenuClickEventArgs,
  ActionArgs,
  BeforePasteEventArgs,
  RowDropEventArgs,
  CellSaveArgs,
  ExcelQueryCellInfoEventArgs,
  AggregateTemplateContext,
  DataResult,
  DetailDataBoundEventArgs,
  FilterSearchBeginEventArgs,
  IEditCell,
  Column
} from '@syncfusion/ej2-react-grids';
import { GridInitialState, GridInitialState2 } from './grid-data';
import {
  Aggregate, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective
} from '@syncfusion/ej2-react-grids';
import { FieldsSettingsModel, ItemModel, NodeCheckEventArgs, NodeSelectEventArgs, SelectEventArgs, SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { TreeViewComponent, ToolbarComponent, ItemsDirective, ItemDirective } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { AsyncSettingsModel, RatingComponent } from '@syncfusion/ej2-react-inputs';
import { UploaderComponent, SuccessEventArgs, FileInfo } from '@syncfusion/ej2-react-inputs'
import { ChangeEventArgs, DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import {
  getInfiniteScrollingLimitation, getLazyLoadingLimitation, getRowVirtualizationLimitation,
  getAutoFillLimitation
} from './limtation-data';
import { BeforeOpenEventArgs, DialogComponent, TooltipComponent } from '@syncfusion/ej2-react-popups';
import { fetchGridData, updateRow, deleteRow, addRow, batchAction, filterDialogData, dragDropData } from './reducer/action';
import { Internationalization } from '@syncfusion/ej2-base';
import {
  employeeDetails, employeeData, createSalesData,
  createScheduleData, createEmployeeData, createDetailSalesData, detailEmployeeData, detailSalesData
} from './datasource';
import arLocalization from './locale/ar.json';
import deLocalization from './locale/de.json';
import frLocalization from './locale/fr.json';
import zhLocalization from './locale/zh.json';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CommandModel } from '@syncfusion/ej2-react-grids';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { ScheduleComponent, Agenda, ViewsDirective, ViewDirective, EventSettingsModel, EventRenderedArgs } from '@syncfusion/ej2-react-schedule';
import {
  Category, ChartComponent, Legend, LineSeries, SeriesCollectionDirective,
  SeriesDirective, Tooltip
} from '@syncfusion/ej2-react-charts';
import { DataManager, Query } from '@syncfusion/ej2-data';

loadLocalization();
createEmployeeData();
createDetailSalesData();
createSalesData();
createScheduleData();

const initialLocalGridPropertyHolder: string[] = ['Dialog', 'allowGrouping', 'allowSorting', 'allowFiltering', 'Excel', 'enableVirtualization', 'allowResizing', 'allowReordering', 'editsettings', 'toolbar', 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Print', 'ExcelExport', 'PdfExport', 'ColumnChooser', 'contextMenuItems'];
const initialHierarchyGridPropertyHolder: string[] = ['allowSorting', 'allowGrouping', 'editsettings', 'Dialog', 'allowFiltering', 'contextMenuItems', 'Excel', 'allowResizing', 'allowReordering', 'contextMenuItems', 'allowPaging', 'toolbar', 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Print', 'ExcelExport', 'PdfExport', 'ColumnChooser'];
const initialRemoteGridPropertyHolder: string[] = ['Normal', 'allowGrouping', 'allowSorting', 'allowFiltering', 'Excel', 'enableVirtualization', 'allowResizing', 'allowReordering', 'editsettings', 'toolbar', 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Print', 'ExcelExport', 'PdfExport', 'ColumnChooser', 'contextMenuItems'];
const initialDetailGridPropertyHolder: string[] = ['allowSorting', 'allowGrouping', 'editsettings', 'Normal', 'allowFiltering', 'allowPaging', 'contextMenuItems', 'Excel', 'allowResizing', 'allowReordering', 'allowPaging', 'toolbar', 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Print', 'ExcelExport', 'PdfExport', 'ColumnChooser'];

let updatedLocalGridProperty: string[] = [];
let updatedHierarchyGridProperty: string[] = [];
let updatedRemoteGridProperty: string[] = [];
let updatedDetailGridProperty: string[] = [];

let createdCalled = true;
let batchEdit: BatchOrders[] = [];

const App = () => {
  const [tabRefresh, setTabRefresh]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(true);
  const tabStatus: React.MutableRefObject<boolean> = useRef(tabRefresh);
  const localization: React.MutableRefObject<string> = useRef('en-US');
  const arabicStatus: React.MutableRefObject<boolean> = useRef(false);
  const theme: React.MutableRefObject<string> = useRef('material3');
  const displayMode = useRef('Mouse');
  const intl: Internationalization = new Internationalization();
  let sidebar: SidebarComponent;
  const [showLimitation, setShowLimitation]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const limitationContent: React.MutableRefObject<JSX.Element> = useRef(<></>);
  const localizationData: { text: string; value: string; }[] = [
    { text: 'English', value: 'en-US' },
    { text: 'Germany', value: 'de' },
    { text: 'French', value: 'fr' },
    { text: 'Arabic', value: 'ar' },
    { text: 'Chinese', value: 'zh' }
  ];
  const themeData: { text: string; value: string; }[] = [
    { text: 'Material3', value: 'material3' },
    { text: 'Material3 Dark', value: 'material3-dark' },
    { text: 'Fluent', value: 'fluent' },
    { text: 'Fluent Dark', value: 'fluent-dark' },
    { text: 'Bootstrap5', value: 'bootstrap5' }
  ];
  let initiallyChecked: Boolean;
  let tab: TabComponent;
  const localGridNodeUpdated: React.MutableRefObject<boolean> = useRef(false);
  const hierarchyGridNodeUpdated: React.MutableRefObject<boolean> = useRef(false);
  const remoteGridNodeUpdated: React.MutableRefObject<boolean> = useRef(false);
  const detailGridNodeUpdated: React.MutableRefObject<boolean> = useRef(false);
  const tabHeader: { text: string; }[] = [{ text: "Local Data" }, { text: "Hierarchy Grid" }, { text: "Remote Data" },
  { text: "Detail Grid" }];
  let tooltip: TooltipComponent;
  const sidebarTree = useRef<TreeViewComponent>(null);
  const showLocalGridCheckBox: React.MutableRefObject<boolean> = useRef(true);
  const showHierarchyGridCheckBox: React.MutableRefObject<boolean> = useRef(true);
  const showRemoteGridCheckBox: React.MutableRefObject<boolean> = useRef(true);
  const showDetailGridCheckBox: React.MutableRefObject<boolean> = useRef(true);
  const hierarchyGridRefreshed: React.MutableRefObject<boolean> = useRef(false);
  const remoteGridRefreshed: React.MutableRefObject<boolean> = useRef(false);
  const detailGridRefreshed: React.MutableRefObject<boolean> = useRef(false);

  const sidebarTreeData: Nodes[] = [
    {
      nodeId: 'allowSorting', nodeText: 'Enable sorting'
    },
    {
      nodeId: 'allowGrouping', nodeText: 'Enable grouping',
      nodeChild: [
        { nodeId: 'enableLazyLoading', nodeText: 'Enable lazyLoading' },
        { nodeId: 'showGroupedColumn', nodeText: 'Enable show grouped column' },
        { nodeId: 'showDropArea', nodeText: 'Disable show drop area' },
        { nodeId: 'allowReordering', nodeText: 'Enable reordering' },
      ]
    },
    {
      nodeId: 'editsettings', nodeText: 'Editing mode', expanded: true,
      nodeChild: [
        { nodeId: 'Dialog', nodeText: 'Enable dialog' },
        { nodeId: 'Normal', nodeText: 'Enable normal' },
        { nodeId: 'Batch', nodeText: 'Enable batch' },
      ]
    },
    {
      nodeId: 'allowFiltering', nodeText: 'Enable filtering', expanded: true,
      nodeChild: [
        { nodeId: 'Excel', nodeText: 'Enable excel ' },
        { nodeId: 'Menu', nodeText: 'Enable menu' },
        { nodeId: 'FilterBar', nodeText: 'Enable filterBar' },
        { nodeId: 'CheckBox', nodeText: 'Enable checkBox' }
      ]
    },
    {
      nodeId: 'allowPaging', nodeText: 'Enable paging',
      nodeChild: [
        { nodeId: 'pageSizes', nodeText: 'Enable pageSizes' }
      ]
    },
    {
      nodeId: 'toolbar', nodeText: 'Toolbar items', expanded: true,
      nodeChild: [
        { nodeId: 'Add', nodeText: 'Enable add' },
        { nodeId: 'Edit', nodeText: 'Enable edit' },
        { nodeId: 'Update', nodeText: 'Enable update' },
        { nodeId: 'Delete', nodeText: 'Enable delete' },
        { nodeId: 'Cancel', nodeText: 'Enable cancel' },
        { nodeId: 'Search', nodeText: 'Enable search' },
        { nodeId: 'Print', nodeText: 'Enable print' },
        { nodeId: 'ExcelExport', nodeText: 'Enable excelExport' },
        { nodeId: 'PdfExport', nodeText: 'Enable pdfExport' },
        { nodeId: 'ImageExport', nodeText: 'Excel/PDF export with image' },
        { nodeId: 'ColumnChooser', nodeText: 'Enable columnChooser' },
      ]
    },
    {
      nodeId: 'enableVirtualization', nodeText: 'Enable virtualization'
    },
    {
      nodeId: 'enableInfiniteScrolling', nodeText: 'Enable infinite scrolling'
    },
    {
      nodeId: 'enableAutoFill', nodeText: 'Enable autoFill'
    },
    {
      nodeId: 'autoFit', nodeText: 'Enable autoFit'
    },
    {
      nodeId: 'allowResizing', nodeText: 'Enable resizing'
    },
    {
      nodeId: 'allowReordering', nodeText: 'Enable reordering'
    },
    {
      nodeId: 'contextMenuItems', nodeText: 'Enable contextMenuItems'
    },
    {
      nodeId: 'enableRtl', nodeText: 'Enable Rtl'
    },
  ];

  const treeField: FieldsSettingsModel = { dataSource: sidebarTreeData as unknown as KeyDataType[], id: 'nodeId', text: 'nodeText', parentID: 'pid', child: 'nodeChild', iconCss: "iconCss" }

  const sidebarTreeCreated = (): void => {
    if (createdCalled) {
      sidebarTree.current?.checkAll(initialLocalGridPropertyHolder);
      sidebarTree.current?.disableNodes(['enableAutoFill', 'Batch', 'enableInfiniteScrolling',
        'allowPaging']);
      initiallyChecked = false;
      createdCalled = false;
    }
  };

  const applyProperties = (): void => {
    sidebar?.hide();
    setShowLimitation(false);
    const tabInstance: TabComponent = (!isNullOrUndefined(tab) ? tab
      : (document.querySelectorAll('.e-tab')[0] as unknown as { ej2_instances: object[]; }).ej2_instances[0]) as TabComponent;
    const checked: string[] = sidebarTree.current?.getAllCheckedNodes() as string[];
    const autofill: boolean = !(checked && (checked.includes('enableAutoFill') || checked.includes('Batch')));
    const gridProperties: GridModel = tabInstance.selectedItem === 0 ? { ...initialLocalGridProperty.current } : tabInstance.selectedItem === 1 ? { ...initialHierarchyGridProperty.current }
      : tabInstance.selectedItem === 2 ? { ...initialRemoteGridProperty.current } : { ...initialDetailGridProperty.current };
    const checkedToolbarItems: (string | ItemModel | ToolbarItem)[] = [];
    processNodes(sidebarTreeData, checked, gridProperties, checkedToolbarItems);
    checkedToolbarItems.push({
      tooltipText: 'Properties',
      prefixIcon: "e-tbar-menu-icon tb-icons",
      id: 'Properties',
      align: 'Right'
    });
    gridProperties.toolbar = checkedToolbarItems.length > 0 ? checkedToolbarItems : undefined;
    if (tabInstance.selectedItem === 0) {
      showLocalGridCheckBox.current = autofill;
      initialLocalGridProperty.current = { ...gridProperties };
      localGridNodeUpdated.current = true;
      updatedLocalGridProperty = [...checked];
    } else if (tabInstance.selectedItem === 1) {
      showHierarchyGridCheckBox.current = autofill;
      initialHierarchyGridProperty.current = { ...gridProperties };
      hierarchyGridNodeUpdated.current = true;
      updatedHierarchyGridProperty = [...checked];
    } else if (tabInstance.selectedItem === 2) {
      dispatch(fetchGridData(null, undefined));
      showRemoteGridCheckBox.current = autofill;
      initialRemoteGridProperty.current = { ...gridProperties };
      remoteGridNodeUpdated.current = true;
      updatedRemoteGridProperty = [...checked];
    } else if (tabInstance.selectedItem === 3) {
      showDetailGridCheckBox.current = autofill;
      initialDetailGridProperty.current = { ...gridProperties };
      detailGridNodeUpdated.current = true;
      updatedDetailGridProperty = [...checked];
    }
    refreshTab();
  };

  const destroyGrid = (): void => {
    const gridInst = tab?.selectedItem === 0 ? localGrid : tab?.selectedItem === 1 ? hierarchyGrid
      : tab?.selectedItem === 2 ? remoteGrid : detailGrid;
    if (gridInst) {
      gridInst?.destroy();
    }
  }

  const refreshTab = (): void => {
    setTimeout(() => {
      hierarchyGridRefreshed.current = tab?.selectedItem === 1 ? true : hierarchyGridRefreshed.current;
      remoteGridRefreshed.current = tab?.selectedItem === 2 ? true : remoteGridRefreshed.current;
      detailGridRefreshed.current = tab?.selectedItem === 3 ? true : detailGridRefreshed.current;
      setTabRefresh(!tabStatus.current);
    }, 0);
  }

  const getCheckedNodes = (checkNodes: string[]): string[] => {
    const checkedNodes: string[] = [];
    const treeViewCheckedNodes: string[] = sidebarTree.current?.getAllCheckedNodes() as string[];
    for (let i = 0; i < checkNodes?.length; i++) {
      if (treeViewCheckedNodes && treeViewCheckedNodes?.includes(checkNodes[i])) {
        checkedNodes.push(checkNodes[i]);
      }
    }
    return checkedNodes;
  };

  const handleNodeChecking = (args: NodeCheckEventArgs): void => {
    const nodeId: string = args.data[0].id as string;
    const checkedNodes: string[] = sidebarTree.current?.getAllCheckedNodes() as string[];
    const disableAndUncheckNodes = (nodes: string[]): void => {
      if (checkedNodes) {
        sidebarTree.current?.disableNodes(nodes);
        sidebarTree.current?.uncheckAll(nodes);
      }
    };
    const showLimitation = (limitationInformation: JSX.Element): void => {
      if (args.isInteracted) {
        limitationContent.current = limitationInformation;
        setShowLimitation(true);
      }
    };
    const checkGrouping = (): void => {
      if (checkedNodes && (checkedNodes.includes('enableLazyLoading') || checkedNodes.includes('showGroupedColumn')
        || checkedNodes.includes('showDropArea') || checkedNodes.includes('allowReordering'))) {
        sidebarTree.current?.checkAll(['allowGrouping']);
      }
    };
    const checkEditsettings = (): void => {
      if (checkedNodes && (checkedNodes.includes('Dialog') || checkedNodes.includes('Normal')
        || checkedNodes.includes('Batch'))) {
        sidebarTree.current?.checkAll(['editsettings']);
      }
    };
    const checkFiltering = (): void => {
      if (checkedNodes && (checkedNodes.includes('Excel') || checkedNodes.includes('Menu')
        || checkedNodes.includes('FilterBar') || checkedNodes.includes('CheckBox'))) {
        sidebarTree.current?.checkAll(['allowFiltering']);
      }
    };
    const checkToolbar = (): boolean => {
      return checkedNodes?.includes('Add') || checkedNodes?.includes('Edit') || checkedNodes?.includes('Update') || checkedNodes?.includes('Delete')
        || checkedNodes?.includes('Cancel') || checkedNodes?.includes('Search') || checkedNodes?.includes('Print') || checkedNodes?.includes('PdfExport')
        || checkedNodes?.includes('ColumnChooser') || checkedNodes?.includes('ColumnChooser');
    };

    if (checkedNodes) {
      if (args.action === 'check') {
        switch (nodeId) {
          case 'enableLazyLoading':
            if (checkedNodes.includes('enableAutoFill')) {
              sidebarTree.current?.uncheckAll(['enableLazyLoading']);
            }
            else {
              disableAndUncheckNodes(['Batch', 'Print']);
            }
            showLimitation(getLazyLoadingLimitation());
            checkGrouping();
            break;
          case 'showGroupedColumn':
          case 'showDropArea':
          case 'allowReordering':
            checkGrouping();
            break;
          case 'enableVirtualization':
            if (!initiallyChecked) {
              if (!checkedNodes.includes('enableAutoFill') && !checkedNodes.includes('Batch')
                && !checkedNodes.includes('allowPaging')) {
                disableAndUncheckNodes(['Batch', 'enableAutoFill', 'enableInfiniteScrolling', 'allowPaging']);
                initiallyChecked = args.isInteracted ? false : initiallyChecked;
              }
              else {
                sidebarTree.current?.uncheckAll(['enableVirtualization']);
              }
              showLimitation(getRowVirtualizationLimitation());
            }
            break;
          case 'enableInfiniteScrolling':
            if (!checkedNodes.includes('enableAutoFill') && !checkedNodes.includes('Batch')
              && !checkedNodes.includes('allowPaging') && !checkedNodes.includes('enableVirtualization')) {
              disableAndUncheckNodes(['allowPaging', 'Batch', 'enableAutoFill', 'enableVirtualization']);
            }
            else if (checkedNodes.includes('enableAutoFill') || checkedNodes.includes('allowPaging') || checkedNodes.includes('enableVirtualization') || checkedNodes.includes('Batch')) {
              sidebarTree.current?.uncheckAll(['enableInfiniteScrolling']);
            }
            showLimitation(getInfiniteScrollingLimitation());
            break;
          case 'enableAutoFill':
            if (!checkedNodes.includes('enableVirtualization') && !checkedNodes.includes('enableInfiniteScrolling')
              && !checkedNodes.includes('enableLazyLoading') && !checkedNodes.includes('Dialog') && !checkedNodes.includes('Normal')) {
              disableAndUncheckNodes(['enableVirtualization', 'enableInfiniteScrolling', 'Normal', 'Dialog', 'enableLazyLoading']);
              sidebarTree.current?.checkAll(['Batch']);
            } else if (checkedNodes.includes('enableVirtualization') || checkedNodes.includes('enableInfiniteScrolling')
              || checkedNodes.includes('enableLazyLoading') || checkedNodes.includes('Dialog') || checkedNodes.includes('Normal')) {
              sidebarTree.current?.uncheckAll(['enableAutoFill']);
            }
            showLimitation(getAutoFillLimitation());
            break;
          case 'editsettings':
            if (!checkedNodes.includes('enableAutoFill') && !checkedNodes.includes('Dialog') && !checkedNodes.includes('Normal')
              && !checkedNodes.includes('Batch')) {
              sidebarTree.current?.checkAll(['Normal']);
            }
            break;
          case 'Dialog':
            sidebarTree.current?.uncheckAll(['Normal', 'Batch']);
            checkEditsettings();
            break;
          case 'Normal':
            sidebarTree.current?.uncheckAll(['Dialog', 'Batch']);
            checkEditsettings();
            break;
          case 'Batch':
            sidebarTree.current?.uncheckAll(['Dialog', 'Normal']);
            checkEditsettings();
            break;
          case 'Excel':
            sidebarTree.current?.uncheckAll(['Menu', 'FilterBar', 'CheckBox']);
            checkFiltering();
            break;
          case 'Menu':
            sidebarTree.current?.uncheckAll(['Excel', 'FilterBar', 'CheckBox']);
            checkFiltering();
            break;
          case 'FilterBar':
            sidebarTree.current?.uncheckAll(['Excel', 'Menu', 'CheckBox']);
            checkFiltering();
            break;
          case 'CheckBox':
            sidebarTree.current?.uncheckAll(['Excel', 'Menu', 'FilterBar']);
            checkFiltering();
            break;
          case 'Add':
          case 'Edit':
          case 'Update':
          case 'Delete':
          case 'Cancel':
          case 'Search':
          case 'Print':
          case 'ExcelExport':
          case 'PdfExport':
          case 'ColumnChooser':
            if (checkToolbar()) {
              sidebarTree.current?.checkAll(['toolbar']);
            }
            break;
          case 'pageSizes':
            sidebarTree.current?.checkAll(['allowPaging']);
            break;
          case 'toolbar':
            if (!checkToolbar()) {
              sidebarTree.current?.checkAll(['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Print', 'ExcelExport', 'PdfExport', 'ColumnChooser', 'ColumnChooser']);
            }
            break;
          case 'allowFiltering':
            if (!(checkedNodes.includes('Excel') || checkedNodes.includes('Menu') || checkedNodes.includes('FilterBar')
              || checkedNodes.includes('CheckBox'))) {
              sidebarTree.current?.checkAll(['Excel']);
            }
            break;
        }
      } else {
        switch (nodeId) {
          case 'enableVirtualization':
            if (checkedNodes.length > 0 && !checkedNodes.includes('enableInfiniteScrolling') && !checkedNodes.includes('enableAutoFill')
              && !checkedNodes.includes('allowPaging') && !checkedNodes.includes('Batch')) {
              sidebarTree.current?.checkAll(['allowPaging']);
              sidebarTree.current?.enableNodes(['Batch', 'enableAutoFill', 'enableInfiniteScrolling', 'allowPaging']);
            }
            break;
          case 'enableInfiniteScrolling':
            if (checkedNodes.length > 0 && !checkedNodes.includes('enableVirtualization') && !checkedNodes.includes('enableAutoFill')
              && !checkedNodes.includes('allowPaging')) {
              sidebarTree.current?.checkAll(['allowPaging']);
              sidebarTree.current?.enableNodes(['enableVirtualization', 'allowPaging', 'Batch', 'enableAutoFill']);
            }
            break;
          case 'enableAutoFill':
            if (!checkedNodes.includes('enableVirtualization') && !checkedNodes.includes('enableAutoFill') && !checkedNodes.includes('Dialog')
              && !checkedNodes.includes('Normal')) {
              sidebarTree.current?.enableNodes(['Dialog', 'Normal', 'enableInfiniteScrolling', 'enableVirtualization', 'enableLazyLoading']);
            }
            break;
          case 'allowGrouping':
            sidebarTree.current?.uncheckAll(getCheckedNodes(['enableLazyLoading', 'showGroupedColumn', 'showDropArea', 'allowReordering']));
            break;
          case 'pageSizes':
            sidebarTree.current?.uncheckAll(['allowPaging']);
            break;
          case 'editsettings':
            sidebarTree.current?.uncheckAll(getCheckedNodes(['Dialog', 'Normal', 'Batch']));
            break;
          case 'allowFiltering':
            sidebarTree.current?.uncheckAll(getCheckedNodes(['Excel', 'Menu', 'FilterBar', 'CheckBox']));
            break;
          case 'Normal':
          case 'Dialog':
          case 'Batch':
            if (!checkedNodes.includes('Dialog') && !checkedNodes.includes('Normal') && !checkedNodes.includes('Batch')) {
              sidebarTree.current?.uncheckAll(['editsettings']);
            }
            break;
          case 'Add':
          case 'Edit':
          case 'Update':
          case 'Delete':
          case 'Cancel':
          case 'Search':
          case 'Print':
          case 'ExcelExport':
          case 'PdfExport':
          case 'ColumnChooser':
            if (!checkedNodes.includes('Add') && !checkedNodes.includes('Edit') && !checkedNodes.includes('Update') && !checkedNodes.includes('Delete')
              && !checkedNodes.includes('Cancel') && !checkedNodes.includes('Search') && !checkedNodes.includes('Print') && !checkedNodes.includes('PdfExport')
              && !checkedNodes.includes('ColumnChooser') && !checkedNodes.includes('ColumnChooser')) {
              sidebarTree.current?.uncheckAll(['toolbar']);
            }
            break;
          case 'Excel':
          case 'Menu':
          case 'FilterBar':
          case 'CheckBox':
            if (!checkedNodes.includes('Excel') && !checkedNodes.includes('Menu') && !checkedNodes.includes('FilterBar') && !checkedNodes.includes('CheckBox')) {
              sidebarTree.current?.uncheckAll(['allowFiltering']);
            }
            break;
          case 'toolbar':
            sidebarTree.current?.uncheckAll(getCheckedNodes(['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Print',
              'ExcelExport', 'PdfExport', 'ColumnChooser', 'ColumnChooser']));
            break;
          case 'enableLazyLoading':
            if (!checkedNodes.includes('enableVirtualization') && !checkedNodes.includes('enableInfiniteScrolling')) {
              sidebarTree.current?.enableNodes(['Batch', 'Print']);
            }
            else {
              sidebarTree.current?.enableNodes(['Print']);
            }
            break;
        }
      }
    }
  };

  const dispatch = useDispatch();
  let mode: DropDownListComponent;
  let localGrid: GridComponent;
  let hierarchyGrid: GridComponent;
  let remoteGrid: GridComponent;
  let detailGrid: GridComponent;

  const initialLocalGridProperty: React.MutableRefObject<GridModel> = useRef<GridModel>({
    enableVirtualization: true,
    showColumnChooser: true,
    allowReordering: true,
    allowFiltering: true,
    allowResizing: true,
    allowSorting: true,
    allowGrouping: true,
    allowExcelExport: true,
    allowPdfExport: true,
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog' as EditMode,
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'ColumnChooser', 'Print', 'ExcelExport', 'PdfExport',
      { tooltipText: 'Properties', prefixIcon: "e-tbar-menu-icon tb-icons", id: 'Properties', align: 'Right' }
    ],
    contextMenuItems: ['AutoFit', 'AutoFitAll',
      'SortAscending', 'SortDescending', 'Copy', 'Edit', 'Delete', 'Save',
      'Cancel', 'PdfExport', 'ExcelExport'] as ContextMenuItem[],
    filterSettings: { type: 'Excel' as FilterType },
    enableRtl: false,
  });

  const initialHierarchyGridProperty: React.MutableRefObject<GridModel> = useRef<GridModel>({
    allowReordering: true,
    allowFiltering: true,
    allowResizing: true,
    allowSorting: true,
    allowPaging: true,
    allowGrouping: true,
    allowExcelExport: true,
    allowPdfExport: true,
    showColumnChooser: true,
    filterSettings: { type: 'Excel', enableInfiniteScrolling: true },
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog' as EditMode,
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'ColumnChooser', 'Print', 'ExcelExport', 'PdfExport',
      { tooltipText: 'Properties', prefixIcon: "e-tbar-menu-icon tb-icons", id: 'Properties', align: 'Right' }
    ],
    contextMenuItems: ['AutoFit', 'AutoFitAll',
      'SortAscending', 'SortDescending', 'Copy', 'Edit', 'Delete', 'Save',
      'Cancel', 'PdfExport', 'ExcelExport'] as ContextMenuItem[],
    selectionSettings: { persistSelection: true },
    enableRtl: false,
  });

  const initialRemoteGridProperty: React.MutableRefObject<GridModel> = useRef<GridModel>({
    enableVirtualization: true,
    showColumnChooser: true,
    allowReordering: true,
    allowFiltering: true,
    allowResizing: true,
    allowSorting: true,
    allowGrouping: true,
    allowExcelExport: true,
    allowPdfExport: true,
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Normal' as EditMode,
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'ColumnChooser', 'Print', 'ExcelExport', 'PdfExport',
      { tooltipText: 'Properties', prefixIcon: "e-tbar-menu-icon tb-icons", id: 'Properties', align: 'Right' }
    ],
    contextMenuItems: ['AutoFit', 'AutoFitAll',
      'SortAscending', 'SortDescending', 'Copy', 'Edit', 'Delete', 'Save',
      'Cancel', 'PdfExport', 'ExcelExport',
    ] as ContextMenuItem[],
    filterSettings: { type: 'Excel' as FilterType },
    enableRtl: false,
  });

  const initialDetailGridProperty: React.MutableRefObject<GridModel> = useRef<GridModel>({
    allowReordering: true,
    allowFiltering: true,
    allowResizing: true,
    allowSorting: true,
    allowPaging: true,
    allowGrouping: true,
    allowExcelExport: true,
    allowPdfExport: true,
    showColumnChooser: true,
    filterSettings: { type: 'Excel', enableInfiniteScrolling: true },
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Normal' as EditMode,
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'ColumnChooser', 'Print', 'ExcelExport', 'PdfExport',
      { tooltipText: 'Properties', prefixIcon: "e-tbar-menu-icon tb-icons", id: 'Properties', align: 'Right' }],
    enableRtl: false,
  });

  const orderIDRules: object = { required: true };
  const customerIDRules: object = { required: true };
  const orderDateRules: object = { required: true };
  const freightIDRules: object = { required: true };
  const shipedDateRules: object = { required: true };
  const shipCountryRules: object = { required: true };
  const shipAddressRules: object = { required: true };

  const shipCountryData: object[] = [
    { text: 'Germany', value: 'Germany' },
    { text: 'France', value: 'France' },
    { text: 'Brazil', value: 'Brazil' },
    { text: 'Belgium', value: 'Belgium' },
    { text: 'Switzerland', value: 'Switzerland' },
    { text: 'Venezuela', value: 'Venezuela' },
    { text: 'Austria', value: 'Austria' },
    { text: 'Mexico', value: 'Mexico' },
  ];
  const modeData: KeyDataType[] = [
    { text: 'Mouse', value: 'Mouse' },
    { text: 'Touch', value: 'Touch' },
  ];
  const editParams: IEditCell = {
    params: {
      dataSource: new DataManager(shipCountryData),
      fields: { text: "text", value: "text" },
      query: new Query()
    }
  }

  let imageStream: string;
  let showEditLabel: boolean = false;
  let batchFlag: boolean = false;
  const path: AsyncSettingsModel = {
    saveUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Save',
    removeUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Remove',
  };

  const uploadSuccess = (args: SuccessEventArgs): void => {
    if (args.operation === 'upload') {
      const fileBlob: Blob = (args.file as FileInfo).rawFile as Blob;
      const file: File = new File([fileBlob], (args.file as FileInfo).name);
      imageStream = getBase64(file);
      batchFlag = true;
    }
  };

  const uploaderEditTemplate = (): JSX.Element => {
    return (
      <div >
        {showEditLabel && (
          <div style={{ paddingBottom: '10px' }}>
            <label style={{ color: '#9b9696', fontSize: '12px' }}>Customer Image</label>
          </div>
        )}
        <div id="upload">
          <UploaderComponent id='deffaultUpload' allowedExtensions={'.jpg,.png'} success={uploadSuccess} asyncSettings={path} multiple={false}></UploaderComponent>
        </div>
      </div>
    )
  }

  const imageTemplate = (props: Orders): JSX.Element => {
    let imageIndex: number = props.EmployeeID % 9;
    imageIndex = imageIndex === 0 ? 1 : imageIndex;
    const altImg: number = !isNullOrUndefined(props.EmployeeID) ? props.EmployeeID : imageIndex;
    const isBase64String: boolean = !isNullOrUndefined(props) && !isNullOrUndefined(props.EmployeeImage)
      && props.EmployeeImage.indexOf("data:application") === -1 ? false : true;
    const matchingBatchEdit: BatchOrders = batchEdit.find((edit) => edit.orderID === props.OrderID) as BatchOrders;
    const src: string = matchingBatchEdit ? matchingBatchEdit.employeeImage : !isBase64String ? "data:image/jpeg;base64," + props.EmployeeImage
      : props.EmployeeImage ? !batchFlag ? 'https://ej2.syncfusion.com/react/demos/src/grid/images/' + imageIndex + '.png' : props.EmployeeImage : '';
    return (<div className='image'>
     <img src={src} alt={altImg.toString()} style={{ lineHeight: '20px' }}/>
    </div>);



  }

  const getBase64 = (file: File): string => {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      imageStream = reader.result as string;
    };
    return imageStream;
  }

  const countryTemplate = (props: Orders): JSX.Element => {
    return (<div className="Mapimage">
      <img src="https://ej2.syncfusion.com/react/demos/src/grid/images/Map.png" className="e-image" alt="" />&nbsp;
      <span id="locationtext">{props.ShipCountry}</span>
    </div>);
  }

  const ratingTemplate = (props: Orders): JSX.Element => {
    return (
      <div>
        <RatingComponent id={'ratingTempalte' + props.EmployeeID} name={'Rating'} value={props.Rating} readOnly={true} cssClass='e-custom-rating'></RatingComponent>
      </div>
    );
  }

  const ratingEditTemplate = (props: Orders): JSX.Element => {
    const isRTL = document.getElementById('overviewgrid')?.classList.contains('e-rtl');
    const ratingClass = isRTL ? 'e-custom-rating e-rtl' : 'e-custom-rating';
    return (
      <div>
        {showEditLabel && (
          <label style={{ color: '#9b9696', fontSize: '11px', top: '-9px', display: "flex" , direction: isRTL ? 'rtl' : 'ltr'}}>Rating</label>
        )}
        <RatingComponent id={'ratingEdit' + props.EmployeeID} name={'Rating'} value={props.Rating} cssClass={ratingClass} ></RatingComponent>
      </div>
    );
  }

  const actionBegin = (args: AddEventArgs): void => {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      showEditLabel = localGrid.editSettings.mode === 'Dialog' ? true : false;
    }
    if (args.requestType === 'save' && batchFlag && imageStream) {
      (args.data as Orders).EmployeeImage = imageStream;
      imageStream = '';
    }
    if (args.requestType === 'filterBeforeOpen' || args.requestType === 'sorting') {
      hideSidebar();
    }
  }

  const queryCellInfo = (args: QueryCellInfoEventArgs): void => {
    if ((args.column as ColumnModel).field === 'Freight' && args.data && (args.data as Orders).Freight !== undefined) {
      const FreightData = (args.data as Orders).Freight;
      (args.cell as HTMLElement).style.backgroundColor = FreightData < 10 ? '#ff704d'
        : FreightData > 10 && FreightData < 100 ? 'rgb(194 194 28)' : 'rgb(19 197 108)';
    }
  }

  const toolbarClick = (args: ContextMenuClickEventArgs): void => {
    const gridInst = tab?.selectedItem === 0 ? localGrid : tab?.selectedItem === 1 ? hierarchyGrid
      : tab?.selectedItem === 2 ? remoteGrid : detailGrid;
    const sidebarInstance: SidebarComponent = (!isNullOrUndefined(sidebar) ? sidebar
      : (document.querySelector('.e-sidebar') as unknown as { ej2_instances: object[]; }).ej2_instances[0]) as SidebarComponent;
    if ((args.item as ItemModel).tooltipText === "Properties") {
      const headerHeight: number = gridInst?.getHeaderContent().getBoundingClientRect().height as number;
      const contentHeight: number = gridInst?.getContent().getBoundingClientRect().height as number;
      const totalHeight: number = headerHeight + contentHeight;
      const currentMode: string = mode?.value as string;
      sidebarInstance.element.style.visibility = '';
      sidebarInstance.position = gridInst?.enableRtl ? 'Left' : 'Right';
      sidebarInstance.element.style.marginLeft = '15px';
      sidebarInstance.element.style.height = totalHeight + 'px';
      sidebarInstance.element.style.marginTop = gridInst?.allowGrouping && gridInst.groupSettings.showDropArea
        ? currentMode === 'Mouse' ? '166px' : '181px'
        : currentMode === 'Mouse' ? '125px' : '133px';
      sidebarInstance.refresh();
      sidebarInstance.toggle();
    } else {
      sidebarInstance.hide();
    }
    const exportSeparator = (args.item.id as string).split('_');
    if (exportSeparator[1] && (exportSeparator[1] === 'pdfexport' || exportSeparator[1] === 'excelexport')
      && ((tab?.selectedItem === 0 && updatedLocalGridProperty.indexOf('ImageExport') === -1)
        || (tab?.selectedItem === 1 && updatedHierarchyGridProperty.indexOf('ImageExport') === -1))) {
      ((gridInst.columns as Column[]).find(column => column.headerText === 'Customer Image') as Column).visible = false;
    }
    if (exportSeparator[1] && exportSeparator[1] === 'pdfexport') {
      gridInst?.pdfExport();
    } else if (exportSeparator[1] && exportSeparator[1] === 'excelexport') {
      gridInst?.excelExport();
    }
  }

  const exportComplete = (): void => {
    if ((tab?.selectedItem === 0 && updatedLocalGridProperty.indexOf('ImageExport') === -1)
      || (tab?.selectedItem === 1 && updatedHierarchyGridProperty.indexOf('ImageExport') === -1)) {
      const gridInst = tab?.selectedItem === 0 ? localGrid : hierarchyGrid;
      ((gridInst.columns as Column[]).find(column => column.headerText === 'Customer Image') as Column).visible = true;
    }
  }

  const beforePaste = (args: BeforePasteEventArgs): void => {
    if ((args.column as ColumnModel).field === 'Freight') {
      let numberParser = intl.getNumberParser({ format: 'c1' });
      (args as { value: number }).value = numberParser((args as { value: number }).value);
    }
  }

  const rowDrop = (args: RowDropEventArgs): void => {
    if (args.fromIndex as number > -1 && args.dropIndex as number > 0) {
      dispatch(dragDropData(args.fromIndex, args.dropIndex, { skip: 0, take: 50 }));
    }
  }

  const rowDragStartHelper = (): void => {
    hideSidebar();
  }

  const cellSave = (args: CellSaveArgs): void => {
    if ((window.event?.target as HTMLElement).closest('.e-upload')) {
      args.cancel = true;
    }
    if (batchFlag && (args.column as ColumnModel).headerText === "Customer Image") {
      const existingIndex: number = batchEdit.findIndex((item) => item.orderID === (args.rowData as Orders).OrderID);
      if (existingIndex !== -1) {
        batchEdit[existingIndex].employeeImage = imageStream;
      } else {
        let newBatchEdit = {
          orderID: (args.rowData as Orders).OrderID,
          employeeImage: imageStream,
        };
        batchEdit.push(newBatchEdit);
      }
    }
  }

  const cellSaved = (): void => {
    batchFlag = false;
  }

  const dataBound = (): void => {
    remoteGrid.scrollModule.refresh();
  }

  const hideSidebar = (): void => {
    const sidebarInstance: SidebarComponent = (!isNullOrUndefined(sidebar) ? sidebar
      : (document.querySelector('.e-sidebar') as unknown as { ej2_instances: object[]; }).ej2_instances[0]) as SidebarComponent;
    if (sidebarInstance) {
      sidebarInstance.hide();
    }
  }

  const recordClick = (): void => {
    hideSidebar();
  }

  const excelPdfQueryCellInfo = (args: ExcelQueryCellInfoEventArgs) => {
    (args.data as Orders).Verified = true
    if (args.column.headerText === "Customer Image") {
      args.image = {
        base64: (args.data as Orders).EmployeeImage,
        height: 70,
        width: 70,
      };
    }
  }

  const footertMaxTemplate = (props: AggregateTemplateContext): JSX.Element => {
    return <span>Sum: ${(props as { Sum?: number }).Sum}</span>;
  }

  const groupFooterSumTemplate = (props: AggregateTemplateContext): JSX.Element => {
    return <span>Total: ${(props as { Sum?: number }).Sum}</span>;
  }

  const groupCaptionMaxTemplate = (props: AggregateTemplateContext): JSX.Element => {
    return <span>Maximum: ${(props as { Max?: number }).Max}</span>;
  }

  const orderColumns: ColumnModel[] = [
    {
      field: 'CustomerID',
      headerText: 'Customer ID',
      width: 140,
      validationRules: customerIDRules,
    },
    {
      field: 'OrderDate',
      headerText: 'Order Date',
      format: 'yMd',
      type: 'date',
      width: 130,
      textAlign: 'Right',
      validationRules: orderDateRules,
      editType: "datepickeredit",
      allowGrouping: false
    },
    {
      field: 'Freight',
      headerText: 'Freight ($)',
      width: 128,
      format: 'C1',
      textAlign: 'Right',
      validationRules: freightIDRules,
      editType: "numericedit",
    }
  ];

  const remoteGridStatusColumns: ColumnModel[] = [
    {
      field: 'Verified',
      headerText: 'Verified',
      defaultValue: false,
      textAlign: 'Center',
      width: '70',
      editType: "booleanedit",
      allowFiltering: false,
      displayAsCheckBox: true
    },
    {
      field: "Rating",
      headerText: 'Rating',
      textAlign: 'Center',
      width: '150',
      allowFiltering: false,
      template: ratingTemplate,
      editTemplate: ratingEditTemplate,
    },
  ];

  const commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];

  const themeChanged = (args: ChangeEventArgs): void => {
    hideSidebar();
    const path: string = 'https://cdn.syncfusion.com/ej2/26.1.40/' + args.value + '.css';
    const primaryThemeLink: HTMLLinkElement = document.querySelector('.theme-primary') as HTMLLinkElement;
    const body: HTMLElement = document.body;
    primaryThemeLink.href = path.toString();
    body.classList.remove(theme.current);
    body.classList.add(args.value as string);
    theme.current = args.value as string;
    refreshTab();
  }

  const localeChanged = (args: ChangeEventArgs): void => {
    hideSidebar();
    localization.current = args.value as string;
    setCulture(args.value as string);
    arabicStatus.current = args.value === "ar";
    if (arabicStatus.current) {
      sidebarTree.current?.checkAll(['enableRtl']);
      sidebarTree.current?.disableNodes(['enableRtl']);
    } else {
      sidebarTree.current?.uncheckAll(['enableRtl']);
      sidebarTree.current?.enableNodes(['enableRtl']);
    }
    const getProperties: GridModel[] = [initialLocalGridProperty.current, initialHierarchyGridProperty.current,
    initialRemoteGridProperty.current, initialDetailGridProperty.current];
    const treeviewProperties: string[][] = [updatedLocalGridProperty, updatedHierarchyGridProperty,
      updatedRemoteGridProperty, updatedDetailGridProperty];
    for (let i = 0; i < getProperties.length; i++) {
      if (arabicStatus.current) {
        if (!treeviewProperties[i].includes('enableRtl')) {
          treeviewProperties[i].push('enableRtl');
        }
      } else {
        const rtlIndex = treeviewProperties[i].indexOf('enableRtl');
        if (rtlIndex !== -1) {
          treeviewProperties[i].splice(rtlIndex, 1);
        }
      }
      getProperties[i].enableRtl = arabicStatus.current;
    }
    refreshTab();
  }

  const onTabSelecting = (args: any): void => {
    args.cancel = args.isSwiped;
    hideSidebar();
  }

  const onTabSelected = (args: SelectEventArgs): void => {
    const eventLog = document.getElementById('EventLog');
    if (eventLog) {
      eventLog.innerHTML = '';
    }
    destroyGrid();
    if (args.selectedIndex === 2) {
      dispatch(fetchGridData(null, undefined));
    }
    refreshTab();
    const enableNodes1: string[] = ['enableLazyLoading', 'allowPaging', 'enableAutoFill', 'Batch'];
    const enableNodes2: string[] = ['enableLazyLoading'];
    const enableNodes3: string[] = ['allowPaging', 'Batch', 'enableAutoFill'];
    const disableNodes1: string[] = ['enableAutoFill', 'Batch', 'enableInfiniteScrolling', 'allowPaging'];
    const disableNodes2: string[] = ['enableLazyLoading', 'enableVirtualization', 'enableInfiniteScrolling'];

    const enableNodes: string[] = args.selectedIndex === 0 ? localGridNodeUpdated.current ? enableNodes1 : enableNodes2
      : args.selectedIndex === 1 ? hierarchyGridNodeUpdated.current ? ['allowPaging', 'enableAutoFill'] : enableNodes3
        : args.selectedIndex === 2 ? remoteGridNodeUpdated.current ? enableNodes1 : enableNodes2
          : detailGridNodeUpdated.current ? ['allowPaging'] : enableNodes3;
    const checkAll: string[] = args.selectedIndex === 0 ? localGridNodeUpdated.current ? updatedLocalGridProperty : initialLocalGridPropertyHolder
      : args.selectedIndex === 1 ? hierarchyGridNodeUpdated.current ? updatedHierarchyGridProperty : initialHierarchyGridPropertyHolder
        : args.selectedIndex === 2 ? remoteGridNodeUpdated.current ? updatedRemoteGridProperty : initialRemoteGridPropertyHolder
          : detailGridNodeUpdated.current ? updatedDetailGridProperty : initialDetailGridPropertyHolder;
    const disableNodes: string[] = args.selectedIndex === 0 ? localGridNodeUpdated.current ? [] : disableNodes1
      : args.selectedIndex === 1 ? hierarchyGridNodeUpdated.current ? disableNodes2 : disableNodes2
        : args.selectedIndex === 2 ? remoteGridNodeUpdated.current ? [] : disableNodes1
          : detailGridNodeUpdated.current ? disableNodes2 : disableNodes2;
    sidebarTree.current?.uncheckAll();
    sidebarTree.current?.enableNodes(enableNodes);
    if (args.selectedIndex === 0 || args.selectedIndex === 1) {
      sidebarTree.current?.enableNodes(['ImageExport']);
    }
    sidebarTree.current?.checkAll(checkAll);
    sidebarTree.current?.disableNodes(disableNodes);
    if (args.selectedIndex === 2 || args.selectedIndex === 3) {
      sidebarTree.current?.disableNodes(['ImageExport']);
    }
    if (arabicStatus.current) {
      sidebarTree.current?.checkAll(['enableRtl']);
      sidebarTree.current?.disableNodes(['enableRtl']);
    }
  }

  const LocalGridRendering = (): JSX.Element => {
    const memoizedLocalGrid: JSX.Element = useMemo(() => {
      return (
        <>
          <div className={displayMode.current === 'Touch' ? 'e-bigger parent-Grid-Container' : 'parent-Grid-Container'} style={{ paddingTop: "20px", paddingBottom: '10px', height: '570px' }}>
            <GridComponent ref={grid => localGrid = grid as GridComponent} dataSource={employeeDetails.slice(0, 10000)} id="overviewgrid"
              actionBegin={actionBegin} pageSettings={GridInitialState2.pageSettings} excelQueryCellInfo={excelPdfQueryCellInfo} pdfQueryCellInfo={excelPdfQueryCellInfo}
              rowHeight={57}
              {...initialLocalGridProperty.current}
              allowRowDragAndDrop={true}
              toolbarClick={toolbarClick}
              queryCellInfo={queryCellInfo}
              recordClick={recordClick}
              rowDragStartHelper={rowDragStartHelper}
              beforeAutoFill={beforePaste}
              cellSave={cellSave}
              cellSaved={cellSaved}
              gridLines={'Both'}
              height={"100%"} width={"100%"}
              excelExportComplete={exportComplete}
              pdfExportComplete={exportComplete}
            >
              <ColumnsDirective>
                {showLocalGridCheckBox.current ? (
                  <ColumnDirective type='checkbox' minWidth={30} width={40}
                  />
                ) : null}
                <ColumnDirective field="OrderID" headerText='Order ID' isPrimaryKey={true} textAlign={'Right'} width={115}
                  validationRules={orderIDRules}
                />
                <ColumnDirective headerText='Customer Image' width={130} textAlign={'Center'} allowFiltering={false}
                  allowGrouping={false}
                  template={imageTemplate}
                  editTemplate={uploaderEditTemplate}
                />
                <ColumnDirective headerText='Order Details' textAlign={'Center'} columns={orderColumns} width='100' />
                <ColumnDirective field='ShipCountry' headerText='Ship Country' width={140} template={countryTemplate} editType='dropdownedit'
                  validationRules={shipCountryRules} dataSource={shipCountryData} />
                <ColumnDirective field='Rating' headerText='Rating' textAlign='Center' width={160} allowFiltering={false} template={ratingTemplate}
                  editTemplate={ratingEditTemplate} />
                <ColumnDirective headerText='Commands' textAlign={'Center'} width='120' commands={commands} />
              </ColumnsDirective>
              <AggregatesDirective>
                <AggregateDirective>
                  <AggregateColumnsDirective>
                    <AggregateColumnDirective field='Freight' type='Sum' footerTemplate={footertMaxTemplate}> </AggregateColumnDirective>
                  </AggregateColumnsDirective>
                </AggregateDirective>
                <AggregateDirective>
                  <AggregateColumnsDirective>
                    <AggregateColumnDirective field='Freight' type='Sum' groupFooterTemplate={groupFooterSumTemplate}> </AggregateColumnDirective>
                  </AggregateColumnsDirective>
                </AggregateDirective>
                <AggregateDirective>
                  <AggregateColumnsDirective>
                    <AggregateColumnDirective field='Freight' type='Max' groupCaptionTemplate={groupCaptionMaxTemplate}> </AggregateColumnDirective>
                  </AggregateColumnsDirective>
                </AggregateDirective>
              </AggregatesDirective>
              <Inject services={[Sort, CommandColumn, Aggregate, Edit, Group, RowDD, Freeze, ContextMenu, ColumnMenu, VirtualScroll, Filter, LazyLoadGroup, Page, PdfExport, InfiniteScroll, ExcelExport, Reorder, Resize, Toolbar, Search, ColumnChooser]} />
            </GridComponent>
          </div>
          <div>
            <FooterTemplate />
          </div>
        </>
      )
    }, [])
    return memoizedLocalGrid;
  }

  const HierachyGridRendering = (): JSX.Element => {
    const memoizedHierachyGrid: JSX.Element = useMemo(() => {
      const childGridOptions: GridModel = {
        columns: [
          { field: 'ProductID', headerText: 'Product ID', width: 120, },
          { field: 'ProductName', headerText: 'ProductName', width: 150 },
          { field: 'Quantity', headerText: 'Quantity', width: 150 },
        ],
        allowPaging: true,
        pageSettings: { pageSize: 5 },
        queryString: 'OrderID',
        dataSource: employeeData,
        width: "600px",
        rowHeight: 37
      };
      return (
        <>
          {hierarchyGridRefreshed.current ?
            <>
              <div className={displayMode.current === 'Touch' ? 'e-bigger parent-Grid-Container' : 'parent-Grid-Container'} style={{ width: '100%', paddingTop: "20px", height: '570px' }} >
                <GridComponent ref={grid => hierarchyGrid = grid as GridComponent} id="gridChild" dataSource={employeeDetails.slice(0, 10000)}
                  excelQueryCellInfo={excelPdfQueryCellInfo} pdfQueryCellInfo={excelPdfQueryCellInfo} allowRowDragAndDrop={true}  {...initialHierarchyGridProperty.current} loadingIndicator={{ indicatorType: 'Shimmer' }}
                  childGrid={childGridOptions} width={"100%"}
                  toolbarClick={toolbarClick}
                  queryCellInfo={queryCellInfo}
                  actionBegin={actionBegin}
                  cellSave={cellSave}
                  cellSaved={cellSaved}
                  recordClick={recordClick}
                  rowDragStartHelper={rowDragStartHelper}
                  rowHeight={57}
                  height={"100%"}
                  gridLines={'Both'}
                  excelExportComplete={exportComplete}
                  pdfExportComplete={exportComplete}>
                  <ColumnsDirective>
                    {showHierarchyGridCheckBox.current ? (
                      <ColumnDirective type='checkbox' minWidth={30} width={38} />) : null}
                    <ColumnDirective field="OrderID" headerText='Order ID' isPrimaryKey={true} textAlign={'Right'} width={115}
                      validationRules={orderIDRules}
                    />
                    <ColumnDirective headerText='Customer Image' width={130} textAlign={'Center'} allowFiltering={false}
                      allowGrouping={false}
                      template={imageTemplate}
                      editTemplate={uploaderEditTemplate}
                    />
                    <ColumnDirective headerText='Order Details' textAlign={'Center'} columns={orderColumns} width='100' />
                    <ColumnDirective field='ShipCountry' headerText='Ship Country' width={140} template={countryTemplate} editType='dropdownedit'
                      validationRules={shipCountryRules} dataSource={shipCountryData} />
                    <ColumnDirective field='Verified' headerText='Verified' defaultValue={false} textAlign='Center' width={70} editType='booleanedit'
                      allowFiltering={false} displayAsCheckBox={true} />
                    <ColumnDirective headerText='Commands' textAlign={'Center'} width='120' commands={commands} />
                  </ColumnsDirective>
                  <AggregatesDirective>
                    <AggregateDirective>
                      <AggregateColumnsDirective>
                        <AggregateColumnDirective field='Freight' type='Sum' footerTemplate={footertMaxTemplate}> </AggregateColumnDirective>
                      </AggregateColumnsDirective>
                    </AggregateDirective>
                    <AggregateDirective>
                      <AggregateColumnsDirective>
                        <AggregateColumnDirective field='Freight' type='Sum' groupFooterTemplate={groupFooterSumTemplate}> </AggregateColumnDirective>
                      </AggregateColumnsDirective>
                    </AggregateDirective>
                    <AggregateDirective>
                      <AggregateColumnsDirective>
                        <AggregateColumnDirective field='Freight' type='Max' groupCaptionTemplate={groupCaptionMaxTemplate}> </AggregateColumnDirective>
                      </AggregateColumnsDirective>
                    </AggregateDirective>
                  </AggregatesDirective>
                  <Inject services={[Sort, DetailRow, Edit, Group, ContextMenu, ColumnMenu, VirtualScroll, Filter, LazyLoadGroup, Page, PdfExport, InfiniteScroll, ExcelExport, Reorder, Resize, Toolbar, Search, ColumnChooser]} />
                </GridComponent>
              </div>
              <div>
                <FooterTemplate />
              </div>
            </>
            : null}
        </>
      );
    }, [])
    return memoizedHierachyGrid;
  }

  const RemoteGridRendering = (): JSX.Element => {
    let filterStateDataSource: React.MutableRefObject<Function> = useRef<Function>(() => { });
    let groupArgs: React.MutableRefObject<object> = useRef({});
    const stateData: DataResult = useSelector((state: State) => state.data);
    let stateAction: ActionArgs | null = useSelector((state: State) => state.action);

    const dataStateChange = (args: DataStateChangeEventArgs): void => {
      const query: Query = (remoteGrid as GridComponent).getDataModule().generateQuery();
      if (args.action && !Object.keys(args.action).length && Object.keys(groupArgs.current).length) {
        dispatch(fetchGridData(groupArgs.current, query));
        groupArgs.current = {};
      } else if ((args.action as FilterSearchBeginEventArgs).requestType === 'filterchoicerequest'
        || (args.action as FilterSearchBeginEventArgs).requestType === 'filterSearchBegin') {
        filterStateDataSource.current = args.dataSource as Function;
        dispatch(filterDialogData(args, query));
      }
      else {
        if (remoteGrid.enableInfiniteScrolling && remoteGrid.groupSettings.disablePageWiseAggregates
          && (remoteGrid.groupSettings.columns as string[]).length) {
          groupArgs.current = args;
        }
        dispatch(fetchGridData(args, query));
      }
    }

    const dataSourceChanged = (state: DataSourceChangedEventArgs): void => {
      const query = remoteGrid.getDataModule().generateQuery();
      if (state.requestType === "save") {
        if (state.action === "add") {
          dispatch(addRow(state, query));
        } else if (state.action === "edit") {
          dispatch(updateRow(state, query));
        }
      }
      if (state.requestType === 'delete') {
        dispatch(deleteRow(state, query));
      }
      if (state.requestType === "batchsave") {
        dispatch(batchAction(state, query));
      }
    }

    useEffect(() => {
      if (stateAction && (stateAction.requestType === 'filterchoicerequest'
        || stateAction.requestType === 'filterSearchBegin')) {
        filterStateDataSource.current(stateData.result);
      } else if (remoteGrid && stateData && stateData.result.length > 0) {
        remoteGrid.dataSource = stateData;
      }
    }, [stateData]);

    const memoizedRemoteGrid: JSX.Element = useMemo(() => {
      return (
        <>
          {remoteGridRefreshed.current ?
            <>
              <div className={displayMode.current === 'Touch' ? 'e-bigger parent-Grid-Container' : 'parent-Grid-Container'} style={{ paddingTop: "20px", paddingBottom: '10px', height: '570px' }}>
                <GridComponent ref={grid => remoteGrid = grid as GridComponent} id="remotegrid"
                  pageSettings={GridInitialState.pageSettings} loadingIndicator={{ indicatorType: 'Shimmer' }}
                  actionBegin={actionBegin} dataStateChange={dataStateChange}
                  dataSourceChanged={dataSourceChanged}
                  rowHeight={57} {...initialRemoteGridProperty.current} toolbarClick={toolbarClick} queryCellInfo={queryCellInfo}
                  allowRowDragAndDrop={true}
                  beforeAutoFill={beforePaste}
                  cellSave={cellSave}
                  cellSaved={cellSaved}
                  recordClick={recordClick}
                  rowDrop={rowDrop}
                  gridLines={'Both'}
                  excelQueryCellInfo={excelPdfQueryCellInfo}
                  pdfQueryCellInfo={excelPdfQueryCellInfo}
                  height={"100%"}
                  width={"100%"}
                  dataBound={dataBound}
                >
                  <ColumnsDirective>
                    {showRemoteGridCheckBox.current ? (
                      <ColumnDirective type='checkbox' minWidth={30} width={40}
                      />
                    ) : null}
                    <ColumnDirective field="OrderID" headerText='Order ID' isPrimaryKey={true} textAlign={'Right'} width={115}
                      validationRules={orderIDRules}
                    />
                    <ColumnDirective headerText='Order Details' textAlign={'Center'} columns={orderColumns} width='100' />
                    <ColumnDirective field='ShipCountry' headerText='Ship Country' width={140} template={countryTemplate} editType='dropdownedit'
                      validationRules={shipCountryRules} dataSource={shipCountryData} edit={editParams} />
                    <ColumnDirective headerText='Status' textAlign={'Center'} width='100' columns={remoteGridStatusColumns} />
                    <ColumnDirective headerText='Commands' textAlign={'Center'} width='120' commands={commands} />
                  </ColumnsDirective>
                  <AggregatesDirective>
                    <AggregateDirective>
                      <AggregateColumnsDirective>
                        <AggregateColumnDirective field='Freight' type='Sum' footerTemplate={footertMaxTemplate}> </AggregateColumnDirective>
                      </AggregateColumnsDirective>
                    </AggregateDirective>
                    <AggregateDirective>
                      <AggregateColumnsDirective>
                        <AggregateColumnDirective field='Freight' type='Sum' groupFooterTemplate={groupFooterSumTemplate}> </AggregateColumnDirective>
                      </AggregateColumnsDirective>
                    </AggregateDirective>
                    <AggregateDirective>
                      <AggregateColumnsDirective>
                        <AggregateColumnDirective field='Freight' type='Max' groupCaptionTemplate={groupCaptionMaxTemplate}> </AggregateColumnDirective>
                      </AggregateColumnsDirective>
                    </AggregateDirective>
                  </AggregatesDirective>
                  <Inject services={[Sort, CommandColumn, RowDD, Aggregate, Edit, Group, Freeze, ContextMenu, ColumnMenu, VirtualScroll, Filter, LazyLoadGroup, Page, PdfExport, InfiniteScroll, ExcelExport, Reorder, Resize, Toolbar, Search, ColumnChooser]} />
                </GridComponent>
              </div>
              <div>
                <FooterTemplate />
              </div>
            </>
            : null}
        </>
      );
    }, [])
    return memoizedRemoteGrid;
  }

  const DetailGridRendering = (): JSX.Element => {
    const memoizedDetailGrid: JSX.Element = useMemo(() => {
      let data: SalesDetails[];
      let salesData: Sales[];
      let eventSettings: EventSettingsModel;

      const generateSalesData = (employeeSalesData: SalesDetails[]): Sales[] => {
        const salesData: Sales[] = [];
        const monthOrder: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const pastMonth: string[] = [];
        const currentMonthIndex: number = new Date().getMonth();
        for (let i: number = 0; i < employeeSalesData.length; i++) {
          const data: SalesDetails = employeeSalesData[i];
          const month: string = monthOrder[data.OrderDate.getMonth()];
          const salesDataIndex: number = salesData.findIndex(data => data.month === month);
          if (salesDataIndex !== -1) {
            salesData[salesDataIndex].quantity += data.Quantity;
            salesData[salesDataIndex].price += data.Price;
          } else {
            salesData.push({ month: month, quantity: data.Quantity, price: data.Price });
          }
        }
        for (let i: number = 0; i < monthOrder.length; i++) {
          let index: number = currentMonthIndex + i;
          index = index >= 12 ? index - 12 : index;
          const month: string = monthOrder[i];
          pastMonth.push(monthOrder[index]);
          if (salesData.findIndex(data => data.month === month) === -1) {
            salesData.push({ month: month, quantity: 0, price: 0 });
          }
        }
        salesData.sort((a, b) => {
          return pastMonth.indexOf(a.month) - pastMonth.indexOf(b.month);
        });
        return salesData;
      }

      const generateMeetings = (employeeSalesData: SalesDetails[], upcomingMeetings: Meeting[]): Meeting[] => {
        const meetings: Meeting[] = [];
        for (let i: number = 0; i < employeeSalesData.length; i++) {
          meetings.push(employeeSalesData[i].Meeting);
        }
        for (let i: number = 0; i < upcomingMeetings.length; i++) {
          const meeting: Meeting = { ...upcomingMeetings[i] };
          meeting.Id = meetings.length + 1;
          meetings.push(meeting);
        }
        return meetings;
      };

      const detailDataBound = (args: DetailDataBoundEventArgs): void => {
        const rowData: Details = args.data as Details;
        data = (detailSalesData as SalesDetails[]).filter(item => item.EmployeeID === rowData.EmployeeID);
        salesData = generateSalesData(data);
        eventSettings = { dataSource: generateMeetings(data, rowData.Meetings) };
      };

      const detailTemplate = (): JSX.Element => {
        const headertext: object[] = [{ text: "Product Sales" }, { text: "Sales Chart" }, { text: "Meeting schedule" }];

        const quantityFormatter = (field: string, data: object): string => {
          return (data as SalesDetails).Quantity + ' g';
        };

        const gridTemplate = (): JSX.Element => {
          return (
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <GridComponent dataSource={data} allowPaging={true} allowSorting={true} allowFiltering={true}
                pageSettings={{ pageSize: 5 }} width={800}>
                <ColumnsDirective>
                  <ColumnDirective field="ProductID" headerText="Product ID" width="130" textAlign="Right" />
                  <ColumnDirective field="ProductName" headerText="Product Name" width="260" />
                  <ColumnDirective field="OrderDate" headerText="Order Date" format='yMd' type='date' textAlign="Right" width="150" />
                  <ColumnDirective field="Quantity" headerText="Quantity" textAlign="Right" valueAccessor={quantityFormatter} />
                  <ColumnDirective field="Price" headerText="Price" textAlign="Right" format='C2' />
                </ColumnsDirective>
                <Inject services={[Page]} />
              </GridComponent>
            </div>);
        };

        const chartTemplate = (): JSX.Element => {
          return (
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }} >
              <ChartComponent width={"800px"} height='302px' tooltip={{ enable: true }} primaryXAxis={{ valueType: 'Category', title: 'Month' }} title='Sales'>
                <Inject services={[Tooltip, LineSeries, Category, Legend]} />
                <SeriesCollectionDirective>
                  <SeriesDirective dataSource={salesData} xName='month' yName='quantity' name='Quantity' marker={{ visible: true, width: 10, height: 10 }} />
                  <SeriesDirective dataSource={salesData} xName='month' yName='price' name='Price' marker={{ visible: true, width: 10, height: 10 }} />
                </SeriesCollectionDirective>
              </ChartComponent>
            </div>
          );
        };

        const eventRendered = (args: EventRenderedArgs): void => {
          if ((args.data as Meeting).StartTime < new Date()) {
            args.element.classList.add('e-past-schedule-event');
          }
        };

        const scheduleTemplate = (): JSX.Element => {
          return (
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <ScheduleComponent width={800} height={400} agendaDaysCount={3} currentView='Agenda' eventSettings={eventSettings} eventRendered={eventRendered}>
                <ViewsDirective>
                  <ViewDirective option='Agenda' />
                </ViewsDirective>
                <Inject services={[Agenda]} />
              </ScheduleComponent>
            </div>
          );
        };

        return (
          <div>
            <TabComponent animation={{
              previous: { effect: 'None', duration: 0, easing: '' },
              next: { effect: 'None', duration: 0, easing: '' }
            }}>
              <TabItemsDirective>
                <TabItemDirective header={headertext[0]} content={gridTemplate} />
                <TabItemDirective header={headertext[1]} content={chartTemplate} />
                <TabItemDirective header={headertext[2]} content={scheduleTemplate} />
              </TabItemsDirective>
            </TabComponent>
          </div>
        );
      }

      return (
        <>
          {detailGridRefreshed.current ?
            <>
              <div className={displayMode.current === 'Touch' ? 'e-bigger parent-Grid-Container' : 'parent-Grid-Container'} style={{ width: '100%', paddingTop: "20px", height: '570px' }} >
                <GridComponent ref={grid => detailGrid = grid as GridComponent} id="gridObj" dataSource={detailEmployeeData.slice(0, 10000)}
                  detailTemplate={detailTemplate}
                  detailDataBound={detailDataBound}
                  excelQueryCellInfo={excelPdfQueryCellInfo} pdfQueryCellInfo={excelPdfQueryCellInfo} allowRowDragAndDrop={true}
                  {...initialDetailGridProperty.current} loadingIndicator={{ indicatorType: 'Shimmer' }}
                  width={"100%"}
                  toolbarClick={toolbarClick}
                  queryCellInfo={queryCellInfo}
                  actionBegin={actionBegin}
                  cellSave={cellSave}
                  cellSaved={cellSaved}
                  recordClick={recordClick}
                  rowDragStartHelper={rowDragStartHelper}
                  height={"100%"}
                  gridLines={'Both'}>
                  <ColumnsDirective>
                    {showDetailGridCheckBox.current ? (
                      <ColumnDirective type='checkbox' minWidth={30} width={40} />) : null}
                    <ColumnDirective field="EmployeeID" headerText='Employee ID' isPrimaryKey={true} textAlign={'Right'} width={70}
                      validationRules={orderIDRules} />
                    <ColumnDirective field="FirstName" headerText='First Name' textAlign={'Right'} width={70} />
                    <ColumnDirective field="SecondName" headerText='Second Name' textAlign={'Right'} width={70} />
                    <ColumnDirective field="Email" headerText='Email' textAlign={'Right'} width={70} />
                    <ColumnDirective field="ReportingPerson" editType="dropdownedit" headerText='Reporting Person' textAlign={'Right'} width={70} />
                  </ColumnsDirective>
                  <Inject services={[Sort, DetailRow, Edit, Group, ContextMenu, ColumnMenu, VirtualScroll, Filter, LazyLoadGroup, Page, PdfExport, InfiniteScroll, ExcelExport, Reorder, Resize, Toolbar, Search, ColumnChooser]} />
                </GridComponent>
              </div>
              <div>
                <FooterTemplate />
              </div>
            </>
            : null}
        </>
      );
    }, [])
    return memoizedDetailGrid;
  }

  const memoizedTab: JSX.Element = React.useMemo(() => {
    tabStatus.current = tabRefresh;
    return (
      <TabComponent ref={t => tab = t as TabComponent} height={705} selected={onTabSelected} selecting={onTabSelecting}
        animation={{
          previous: { effect: 'None', duration: 0, easing: '' },
          next: { effect: 'None', duration: 0, easing: '' }
        }}>
        <TabItemsDirective>
          <TabItemDirective header={tabHeader[0]} content={LocalGridRendering} />
          <TabItemDirective header={tabHeader[1]} content={HierachyGridRendering} />
          <TabItemDirective header={tabHeader[2]} content={RemoteGridRendering} />
          <TabItemDirective header={tabHeader[3]} content={DetailGridRendering} />
        </TabItemsDirective>
      </TabComponent>
    );
  }, [tabRefresh]);

  const modeChanged = (arg: ChangeEventArgs): void => {
    hideSidebar();
    displayMode.current = arg.value as string;
    refreshTab();
  }

  const FooterTemplate = (): JSX.Element => {
    return (
      <ToolbarComponent id="listToolbar" >
        <ItemsDirective>
          <ItemDirective template={localeComponent} />
          <ItemDirective template={themeComponent} />
          <ItemDirective template={modeComponent} />
        </ItemsDirective>
      </ToolbarComponent>
    );
  }

  const localeComponent = (): JSX.Element => {
    return (
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="dropDownList" style={{ marginLeft: '20px', fontSize: '15px' }}>
          Localization
        </label>
        <span style={{ fontSize: '17px', paddingRight: '10px' }}>:</span>
        <DropDownListComponent
          id="dropDownList"
          className="dropdown"
          index={0}
          width={140}
          value={localization.current}
          dataSource={localizationData}
          change={localeChanged}
          fields={{ text: 'text', value: 'value' }}
        />
      </div>
    );
  }

  const themeComponent = (): JSX.Element => {
    return (
      <div style={{ marginTop: '9px' }}>
        <label htmlFor="themeDropDown" style={{ marginLeft: '20px', fontSize: '15px' }}>
          Theme
        </label>
        <span style={{ fontSize: '17px', paddingRight: '10px' }}>:</span>
        <DropDownListComponent
          id="themeDropDown"
          width={140}
          dataSource={themeData}
          value={theme.current}
          change={themeChanged}
          fields={{ text: 'text', value: 'value' }}
        />
      </div>
    );
  }

  const modeComponent = (): JSX.Element => {
    return (
      <div style={{ marginTop: '9px' }}>
        <label htmlFor="modeDropDown" style={{ marginLeft: '20px', fontSize: '15px' }}>
          Mode
        </label>
        <span style={{ fontSize: '17px', paddingRight: '10px' }}>:</span>
        <DropDownListComponent
          id="modeDropDown"
          ref={m => mode = m as DropDownListComponent}
          width={140}
          index={0}
          dataSource={modeData}
          change={modeChanged}
          value={displayMode.current}
          fields={{ text: 'text', value: 'value' }}
        />
      </div>
    );
  }

  const nodeSelecting = (args: NodeSelectEventArgs): void => {
    args.cancel = true;
  };

  const propertyDescription: { [key: string]: string } = {
    "Enable sorting": "The allowSorting property enables the sorting of grid records when clicking on the column header.",
    "Enable filtering": "The allowFiltering property enables the filter bar to be displayed.",
    "Enable Rtl": "The enableRtl property enables or disables rendering the component in right-to-left direction.",
    "Enable contextMenuItems": "The contextmenuitems property enables right-clicks anywhere within the grid to perform tasks such as sorting, filtering, editing, or any other relevant actions without the need to navigate through the grid’s interface",
    "Enable reordering": "The allowReordering property enables the reordering of grid columns by dragging and dropping columns from one index to another",
    "Enable resizing": "The allowResizing property enables the resizing of grid columns.",
    "Enable autoFit": "The autoFit property, when enabled, automatically adjusts the width of columns based on the given width.",
    "Enable autoFill": "When the enableAutoFill property is enabled, an auto-fill icon will be displayed when cells are selected for copying.",
    "Enable infinite scrolling": "The enableInfiniteScrolling property loads data in the Grid when the scrollbar reaches the end, facilitating the handling of large datasets.",
    "Enable virtualization": "The enableVirtualization property allows the Grid to render only the rows visible within the viewport and load subsequent rows on vertical scrolling. This helps in efficiently handling large datasets in the Grid.",
    "Enable paging": "The allowPaging property enables a pager control to be rendered at the bottom of the grid, allowing you to navigate through different pages of data.",
    "Enable pageSizes": "The pageSize property enables the rendering of a dropdown list within the pager, allowing you to select the desired page size. The selected page size determines the number of records displayed on each page of the grid..",
    "Editing mode": "Determines the editing mode of the Grid",
    "Enable grouping": "The allowGrouping property allows dynamically grouping or ungrouping columns. Grouping can be done by dragging and dropping columns from the column header to the group drop area",
    'Enable toolbar': "The toolbar property defines the Toolbar items of the Grid. It contains built-in and custom toolbar items. If a string value is assigned to the toolbar option, it is considered as the template for the entire Grid Toolbar. If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the Grid’s Toolbar",
    'Enable add': "Adds a new record.",
    'Enable edit': "Edits the selected record.",
    'Enable update': " Updates the edited record.",
    'Enable delete': "Deletes the selected record.",
    'Enable cancel': "Cancels the edit state.",
    'Enable search': "Searches records by the given key.",
    'Enable print': "Prints the Grid.",
    'Enable excelExport': "Export the Grid to Excel.",
    'Enable pdfExport': "Export the Grid to PDF",
    'Excel/PDF export with image': "Excel/PDF export with image",
    'Enable columnChooser': "The ColumnChooser feature allows dynamic showing or hiding of columns",
    'Enable excel ': "The Excel-like filtering simplifies complex filtering operations on specific columns, enabling quick data location and manipulation, akin to Microsoft Excel.",
    'Enable menu': "The filter menu UI enables the application of filters using various operators.",
    'Enable filterBar': "The filter bar row is rendered next to the header, enabling you to filter data. You can filter the records using different expressions depending on the column type.",
    'Enable checkBox': "The checkbox filter allows data to be filtered based on checkbox selections within a column. This powerful filtering option simplifies the process of narrowing down data.",
    'Enable dialog': "The dialog mode allows you to edit the data of the currently selected row using a dialog window.",
    'Enable normal': "The inline mode allows editing cell values directly within the grid's rows.",
    'Enable batch': "The batch mode allows you to simultaneously edit multiple cells and save them in a single request to the data source.",
    'Enable lazy loading': "The Lazy load grouping, allows the Grid to render only the initial level caption rows in collapsed state while grouping. The child rows of each caption will render only when we expand the captions.",
    'Enable show grouped column': "The showGroupedColumn property hides the grouped column after grouping.",
    'Disable show drop area': "The showDropArea property makes the group drop area element visible at the top of the Grid.",
  };

  const beforeOpen = ((args: BeforeOpenEventArgs): void => {
    const element: HTMLElement = (args.target as HTMLElement).closest('.treeviewdiv')?.querySelector('.treeName') as HTMLElement;
    const description: string = propertyDescription[element?.innerText];
    if (document.querySelector('.exclamation-container') && !isNullOrUndefined(description)) {
      (tooltip as TooltipComponent).content = description;
    }
  });

  const nodeTemplate = (data: Nodes): JSX.Element => (
    <div className="treeviewdiv">
      <div className="textcontent">
        <span id="treeText" className="treeName">{data.nodeText}</span>
      </div>
      <div className="exclamation-container">
        <span className="fa-solid fa-circle-exclamation" ></span>
      </div>
    </div>
  );

  const memoizedTreeview: JSX.Element = React.useMemo(() => {
    return (
      <SidebarComponent id="sideTree" className="sidebar-treeview" type={"Over"} width={340} style={{ visibility: "hidden" }}
        ref={s => sidebar = s as SidebarComponent} target='.main-sidebar-content' isOpen={false}>
        <div className='res-main-menu'>
          <TooltipComponent ref={t => tooltip = t as TooltipComponent} windowCollision={true} mouseTrail={true}
            target=".exclamation-container" position="LeftCenter" beforeOpen={beforeOpen}>
            <TreeViewComponent ref={sidebarTree} id='mainTree' cssClass="main-treeview" fields={treeField}
              showCheckBox={true} created={sidebarTreeCreated}
              nodeChecked={handleNodeChecking}
              autoCheck={false} expandOn='Click'
              nodeTemplate={nodeTemplate}
              nodeSelected={nodeSelecting} />
            <div id="treeButton">
              <ButtonComponent id="applyButton" className="button" cssClass="e-primary" onClick={applyProperties}>
                Apply
              </ButtonComponent>
            </div>
          </TooltipComponent>
        </div>
      </SidebarComponent>
    );
  }, []);

  return (
    <div className="control-section" id="responsive-wrapper">
      <div id="reswrapper">
        <div>
          {memoizedTreeview}
        </div>
        <div className="main-sidebar-content" id="main-text">
          <div className="sidebar-content">
            <div className="content-wrapper control-section" >
              {memoizedTab}
            </div>
          </div>
        </div>

        {showLimitation && (
          <div className="limitation-dialog-overlay">
            <DialogComponent
              id="limitationDialog"
              visible={true}
              width="750px"
              height={"320px"}
              showCloseIcon={true}
              close={() => setShowLimitation(false)}
            >
              <div>
                {limitationContent.current}
              </div>
            </DialogComponent>
          </div>
        )}
      </div>
    </div>
  )
}

export default (App);

function processNodes(nodes: Nodes[], checkedNodes: string[], gridProperties: GridModel, checkedToolbarItems: (string | ItemModel | ToolbarItem)[]) {
  nodes.forEach((node) => {
    if (
      checkedNodes.includes(node.nodeId) ||
      (node.nodeChild &&
        node.nodeChild.some((childNode) => checkedNodes.includes(childNode.nodeId)))
    ) {
      handleCheckedNode(node, gridProperties, checkedToolbarItems, checkedNodes);
    } else {
      handleUncheckedNode(node, gridProperties);
    }
  });
};

function handleCheckedNode(node: Nodes, gridProperties: GridModel, checkedToolbarItems: (string | ItemModel | ToolbarItem)[], checkedNodes: string[]) {
  switch (node.nodeId) {
    case 'editsettings':
      gridProperties.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
      break;
    case 'contextMenuItems':
      let menuItems: ContextMenuItem[] | ContextMenuItemModel[] = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending'];
      menuItems = checkedNodes.includes('enableAutoFill') ? [...menuItems, 'Copy', 'Edit', 'Save', 'Cancel']
        : [...menuItems, 'Copy', 'Edit', 'Delete', 'Save', 'Cancel'];
      gridProperties.contextMenuItems = [...menuItems, 'PdfExport', 'ExcelExport'];
      break;
    case 'enableAutoFill':
      gridProperties[node.nodeId] = true;
      gridProperties.selectionSettings = { type: 'Multiple', mode: 'Cell' };
      break;
    default:
      if (node.nodeId !== "toolbar") {
        (gridProperties as KeyDataType)[node.nodeId] = true;
      }
      break;
  }
  if (node.nodeChild) {
    node.nodeChild.forEach((childNode) => {
      if (checkedNodes.includes(childNode.nodeId)) {
        handleChildNodeChecked(childNode, gridProperties, checkedToolbarItems);
      } else {
        handleChildNodeUnchecked(childNode, gridProperties, checkedToolbarItems);
      }
    });
  }
};

function handleChildNodeUnchecked(childNode: Nodes, gridProperties: GridModel, checkedToolbarItems: (string | ItemModel | ToolbarItem)[]) {
  if (!gridProperties.groupSettings) {
    gridProperties.groupSettings = {};
  }
  switch (childNode.nodeId) {
    case 'ExcelExport':
    case 'PdfExport':
      delete gridProperties[`allow${childNode.nodeId}`];
      break;
    case 'Add':
    case 'Edit':
    case 'Update':
    case 'Delete':
    case 'Cancel':
    case 'Print':
    case 'Search':
      const index = checkedToolbarItems.indexOf(childNode.nodeId);
      if (index > -1) {
        checkedToolbarItems.splice(index, 1);
      }
      break;
    case 'showGroupedColumn':
    case 'enableLazyLoading':
    case 'allowReordering':
      gridProperties.groupSettings[childNode.nodeId] = false;
      break
    case 'showDropArea':
      gridProperties.groupSettings[childNode.nodeId] = true;
      break;
  }
};

function handleUncheckedNode(node: Nodes, gridProperties: GridModel) {
  switch (node.nodeId) {
    case 'editsettings':
      delete gridProperties.editSettings;
      break;
    default:
      (gridProperties as KeyDataType)[node.nodeId] = false;
      break;
  }
};

function handleChildNodeChecked(childNode: Nodes, gridProperties: GridModel, checkedToolbarItems: (string | ItemModel | ToolbarItem)[]) {
  const initializeGroupSettings = () => {
    if (!gridProperties.groupSettings) {
      gridProperties.groupSettings = {};
    }
  }
  switch (childNode.nodeId) {
    case 'Dialog':
    case 'Normal':
    case 'Batch':
      (gridProperties.editSettings as EditSettingsModel).mode = childNode.nodeId;
      break;
    case 'Excel':
    case 'FilterBar':
    case 'Menu':
    case 'CheckBox':
      gridProperties.filterSettings = { type: childNode.nodeId };
      break;
    case 'ExcelExport':
    case 'PdfExport':
      checkedToolbarItems.push(childNode.nodeId);
      gridProperties[`allow${childNode.nodeId}`] = true;
      break;
    case 'ColumnChooser':
      gridProperties['showColumnChooser'] = true;
      checkedToolbarItems.push('ColumnChooser');
      break;
    case 'Add':
    case 'Edit':
    case 'Update':
    case 'Delete':
    case 'Cancel':
    case 'Print':
    case 'Search':
      checkedToolbarItems.push(childNode.nodeId);
      break;
    case 'showGroupedColumn':
    case 'enableLazyLoading':
    case 'allowReordering':
      initializeGroupSettings();
      (gridProperties.groupSettings as GroupSettingsModel)[childNode.nodeId] = true;
      break;
    case 'showDropArea':
      initializeGroupSettings();
      (gridProperties.groupSettings as GroupSettingsModel)[childNode.nodeId] = false;
      break;
    case 'pageSizes':
      gridProperties.pageSettings = { pageSizes: true };
      break;
  }
};

function loadLocalization() {
  const localization = [arLocalization, deLocalization, frLocalization, zhLocalization];
  for (let i = 0; i < localization.length; i++) {
    L10n.load(localization[i]);
  }
};

interface BatchOrders {
  orderID: number;
  employeeImage: string
}

export interface Orders {
  OrderID: number;
  ShipCountry: string;
  EmployeeID: number;
  EmployeeImage: string;
  Rating: number;
  Freight: number;
  Verified: boolean;
}

export interface Details {
  EmployeeID: number;
  Meetings: Meeting[];
}

interface SalesDetails {
  EmployeeID: number;
  Quantity: number;
  Price: number;
  OrderDate: Date;
  Meeting: Meeting;
}

interface Sales {
  month: string;
  quantity: number;
  price: number;
}

export interface Meeting {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  IsReadonly: boolean;
}

export interface KeyDataType { [key: string]: Object; }

interface Nodes {
  nodeId: string;
  nodeText: string;
  expanded?: boolean;
  nodeChild?: Nodes[];
}

interface State {
  action: ActionArgs;
  data: DataResult;
}
