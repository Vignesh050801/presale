const getLazyLoadingLimitation = (): JSX.Element => {
    return (
        <div>
            <b>Lazy Loading Limitations: (<a href='https://ej2.syncfusion.com/react/documentation/grid/scrolling/virtual-scrolling#limitations'>Limitations Link</a>)</b><br /><br />
            <ul>
                <li>Due to the element height limitation in browsers, the maximum number of records loaded by the grid is limited due to the browser capability.</li>
                <li>Lazy load grouping is only supported by the UrlAdaptor and JsonAdaptor adaptors.</li>
                <li>Lazy load grouping is not compatible with the following features:</li>
                <ul>
                    <li>Batch editing</li>
                    <li>Row template</li>
                    <li>Print</li>
                    <li>Row drag and drop in collapsed group</li>
                    <li>ExpandAll method</li>
                    <li>Column virtualization</li>
                    <li>Hierarchical Grid</li>
                    <li>Detail Template</li>
                    <li>Row and Cell Spanning</li>
                </ul>
                <li>Programmatic selection is not supported in lazy load grouping.</li>
                <li>Drag selection, Cell selection (box and flow), Row Selection is not working in collapsed state.</li>
                <li>Clipboard is not supported when the groups are in collapsed state.</li>
                <li>AutoFill support for Batch mode editing, so this feature is not compatible with Lazy load.</li>


            </ul>
        </div>
    );
};

const getRowVirtualizationLimitation = (): JSX.Element => {
    return (
        <div>
            <b>Limitations for RowVirtualization: (<a href='https://ej2.syncfusion.com/react/documentation/grid/scrolling/virtual-scrolling#limitations'>Limitations Link</a>)</b><br /><br />
            <ul>
                <li>Row virtual scrolling is not compatible with the following features:</li>
                <li>Batch editing</li>
                <li>Detail template</li>
                <li>Row template</li>
                <li>Rowspan</li>
                <li>Autofill</li>
                <li>Hierarchy grid</li>
                <li>Paging</li>
                <li>When row virtual scrolling is activated, compatibility for copy-paste and drag-and-drop operations is limited to the data items visible in the current viewport of the grid.</li>
                <li>The cell-based selection is not supported for row virtual scrolling.</li>
                <li>Using different row heights with a template column, when the template height differs for each row, is not supported.</li>
                <li>Group expand and collapse state will not be persisted for remote data.</li>
                <li>Due to the element height limitation in browsers, the maximum number of records loaded by the Grid is limited by the browser capability.</li>
                <li>The height of the grid content is calculated using the row height and total number of records in the data source and hence features which changes row height such as text wrapping are not supported.</li>
                <li>If you want to increase the row height to accommodate the content then you can specify the row height as below to ensure all the table rows are in the same height.</li>
                <li>Since data is virtualized in grid, the aggregated information and total group items are displayed based on the current view items. To get these information regardless of the view items, refer to the Group with paging topic.</li>
                <li>It is necessary to set a static height for the component or its parent container when using row virtualization. The 100% height will work only if the component height is set to 100%, and its parent container has a static height.</li>
                <li>AutoFill support for Batch mode editing, so this feature is not compatible with Row Virtualization feature.</li>

            </ul>
        </div>
    );
};

const getColumnVirtualizationLimitation = (): JSX.Element => {
    return (
        <div>
            <b>Limitations for ColumnVirtualization:(<a href='https://ej2.syncfusion.com/react/documentation/grid/scrolling/virtual-scrolling#limitations'>Limitations Link</a>)</b><br /><br />
            <ul>
                <li> While using column virtual scrolling, column width should be in pixels. Percentage values are not accepted</li>
                <li>Selected column details are only retained within the viewport. When the next set of columns is loaded, the selection for previously visible columns is lost.</li>
                <li>The cell selection is not supported for column virtual scrolling</li>
                <li>The following features are compatible with column virtualization and work within the viewport:
                    <ul>
                        <li>Column resizing</li>
                        <li>Column reordering</li>
                        <li>Column chooser</li>
                        <li>Auto-fit</li>
                        <li>Print</li>
                        <li>Clipboard</li>
                        <li>Column menu - Column chooser, AutofitAll, Grouping</li>
                    </ul>
                </li>
                <li>Column virtual scrolling is not compatible with the following features:
                    <ul>
                        <li>Grouping</li>
                        <li>Colspan</li>
                        <li>Batch editing</li>
                        <li>Column with infinite scrolling</li>
                        <li>Stacked header</li>
                        <li>Row template</li>
                        <li>Detail template</li>
                        <li>Hierarchy grid</li>
                        <li>Autofill</li>
                        <li>Column chooser</li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

const getInfiniteScrollingLimitation = (): JSX.Element => {
    return (
        <div>
            <b>Limitations for InfiniteScrolling:(<a href='https://ej2.syncfusion.com/react/documentation/grid/scrolling/virtual-scrolling#limitations'>Limitations Link</a>)</b><br /><br />
            <ul>
                <li>Due to the element height limitation in browsers, the maximum number of records loaded by the grid is limited due to the browser capability.</li>

                <li>It is necessary to set a static height for the component or its parent container when using infinite scrolling. The 100% height will work only if the component height is set to 100%, and its parent container has a static height.</li>
                <li>When infinite scrolling is activated, compatibility for copy-paste and drag-and-drop operations is limited to the data items visible in the current viewport of the grid.</li>
                <li>Cell selection will not be persisted in cache mode.</li>
                <li>The group records cannot be collapsed in cache mode.</li>
                <li>Lazy load grouping with infinite scrolling does not support cache mode, and the infinite scrolling mode is exclusively applicable to parent-level caption rows in this scenario.</li>
                <li>The aggregated information and total group items are displayed based on the current view items. To get these information regardless of the view items, refer to the Group with paging topic.</li>
                <li>Programmatic selection using the selectRows and selectRow method is not supported in infinite scrolling.</li>
                <li>InfiniteScrolling support for Normal and Dialog mode editing, so this feature is not compatible with AutoFill.</li>
                <li>Infinite scrolling is not compatible with the following features:
                    <ul>
                        <li>Batch editing</li>
                        <li>Row spanning</li>
                        <li>Column spanning</li>
                        <li>Row template</li>
                        <li>Row virtual scrolling</li>
                        <li>Column virtual scrolling</li>
                        <li>Detail template</li>
                        <li>Hierarchy features</li>
                        <li>Paging</li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

const getAutoFillLimitation = (): JSX.Element => {
    return (
        <div>
            <b>Limitations for AutoFill:(<a href='https://ej2.syncfusion.com/react/documentation/grid/scrolling/virtual-scrolling#limitations'>Limitations Link</a>)</b><br /><br />
            <ul>
                <li>AutoFill does not automatically convert string values to number or date types. If the selected cells contain string data and are dragged to number-type cells, the target cells will display NaN. Similarly, when dragging string-type cells to date-type cells, the target cells will display as an empty cell. It is important to ensure data types are compatible before using autofill to avoid unexpected results.
                </li>
                <li>The AutoFill feature does not support generating non-linear series or sequential data automatically. Cannot create complex series or patterns by simply dragging cells with non-sequential data. The autofill feature is designed for copying and pasting data from a selected range of cells.
                </li>
                <li>Normal and Dialog mode editing are not compatible with AutoFill
                </li>
                <li>EnableLazyLoading and InfiniteScrolling support for Normal and Dialog mode editing, so this feature is not compatible with AutoFill.</li>
                <li>The AutoFill feature supports cell selection mode, so delete operations cannot be performed.</li>
            </ul>

        </div>
    );
};

export {
    getLazyLoadingLimitation,
    getRowVirtualizationLimitation,
    getColumnVirtualizationLimitation,
    getInfiniteScrollingLimitation,
    getAutoFillLimitation
};
