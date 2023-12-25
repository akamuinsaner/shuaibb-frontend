import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import decamelize from 'decamelize';
import camelize from 'camelize'

export interface HeadCell<T> {
    id?: keyof T;
    label: string;
    multiLine?: boolean;
    type?: 'string' | 'number' | 'array' | 'boolean' | 'date',
    render?: (value: any, record: T, index: number) => any;
}

export type PageInfo = {
    offset: number;
    limit: number;
    total: number;
}

export type OrderParams<T> = {
    order: 'asc' | 'desc',
    orderBy: keyof T
}

const ListTableHeader = <T,>({
    headers,
    orderParams,
    onOrderChange,
    checkable,
    selectedKeys,
    onSelectRows,
    pageInfo,
    rowKey,
    data,
    expandable,
}: {
    checkable?: boolean;
    headers: HeadCell<T>[],
    orderParams: OrderParams<T>
    onOrderChange: (key: keyof T) => void;
    selectedKeys?: any[];
    onSelectRows?: (selectedKeys: any) => void;
    pageInfo: PageInfo;
    rowKey?: string | { (record: T): string };
    data: T[];
    expandable?: boolean;
}) => {
    const { offset, limit, total } = (pageInfo || {});
    const curRowCount = pageInfo ? (offset + 1 * limit) < total ? limit : (total - limit * offset) : data.length

    return (
        <TableHead>
            {expandable ? <TableCell></TableCell> : null}
            {checkable ? <TableCell padding='checkbox'>
                <Checkbox
                    color="primary"
                    checked={selectedKeys.length === curRowCount}
                    indeterminate={selectedKeys.length > 0 && selectedKeys.length < curRowCount}
                    onChange={(e: any) => {
                        if (e.target.checked) {
                            onSelectRows(data.map((item: any) =>
                                typeof rowKey === 'function' ? rowKey(item) : item[rowKey]))
                        } else {
                            onSelectRows([])
                        }
                    }}
                />
            </TableCell> : null}
            {headers.map((headCell) => {
                const supportSort = ['number', 'date'].includes(headCell.type)
                return <TableCell
                    sx={{ whiteSpace: 'nowrap' }}
                    key={String(headCell.id)}
                    align={supportSort ? 'right' : 'left'}
                    sortDirection={orderParams?.orderBy === headCell.id ? orderParams.order : false}
                >
                    {
                        !(supportSort && orderParams) ?
                            headCell.label : (
                                <TableSortLabel
                                    active={orderParams.orderBy === headCell.id}
                                    direction={orderParams.orderBy === headCell.id ? orderParams.order : 'asc'}
                                    onClick={(e) => onOrderChange(headCell.id)}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                            )
                    }
                </TableCell>
            })}
        </TableHead>
    )
}

const ListTableBody = <T,>({
    data,
    headers,
    checkable,
    selectedKeys,
    onSelectRows,
    rowKey,
    rowEvents,
    expandable,
    expandContent,
    expandRows,
    setExpandRows
}: {
    expandable: boolean;
    expandRows?: any[];
    setExpandRows?: (r: any[]) => void;
    expandContent?: (record: T) => any;
    data: T[];
    headers: HeadCell<T>[],
    checkable?: boolean;
    selectedKeys?: any[];
    onSelectRows?: (selectedKeys: any) => void;
    rowKey?: string | { (record: T): string };
    rowEvents?: {
        onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, record: T) => void;
        onDoubleClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>, record: T) => void;
    }
}) => {
    return (
        <TableBody>
            {data.map((row: any, index) => {
                const actualKey = typeof rowKey === 'function' ? rowKey(row) : row[rowKey]
                return ([
                        <TableRow
                            hover
                            sx={{ cursor: 'pointer' }}
                            tabIndex={-1}
                            key={actualKey}
                            onContextMenu={(e) => rowEvents?.onContextMenu && rowEvents.onContextMenu(e, row)}
                            onDoubleClick={(e) => rowEvents?.onDoubleClick && rowEvents.onDoubleClick(e, row)}
                        >
                            {expandable ? <TableCell>
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setExpandRows(expandRows.includes(actualKey)
                                        ? expandRows.filter(key => key !== actualKey) 
                                        : [...expandRows, actualKey])}
                                >
                                    {expandRows.includes(actualKey) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </TableCell> : null}
                            {checkable ? <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    checked={selectedKeys.includes(actualKey)}
                                    onClick={(e: any) => {
                                        if (e.target.checked) {
                                            onSelectRows([...selectedKeys, actualKey])
                                        } else {
                                            onSelectRows(selectedKeys.filter(item => item !== actualKey))
                                        }
                                    }}
                                />
                            </TableCell> : null}
                            {headers.map((headCell, cIndex) => {
                                const supportSort = ['number', 'date'].includes(headCell.type)
                                const render = headCell.render;
                                let renderText = row[String(headCell.id)];
                                if (render) {
                                    renderText = render(renderText, row, index)
                                }
                                return <TableCell
                                    sx={{ whiteSpace: headCell.multiLine ? 'normal' : 'nowrap' }}
                                    id={String(headCell.id)}
                                    key={String(headCell.id)}
                                    align={supportSort ? 'right' : 'left'}
                                >
                                    {renderText}
                                </TableCell>
                            })}
                        </TableRow>,
                        expandRows.includes(actualKey)  ? <TableRow key={`${actualKey}-history`} >
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1}>
                                {expandContent(row)}
                            </TableCell>
                        </TableRow> : null
                ])
            })}
        </TableBody>
    )
}

const ListTable = <T,>({
    headers,
    data,
    pageInfo,
    onChange,
    orderParams,
    checkable,
    selectedKeys,
    onSelectRows,
    rowKey,
    rowEvents,
    expandable = false,
    expandContent,
    showPaganition = true
}: {
    expandContent?: (record: T) => any;
    showPaganition?: boolean;
    expandable?: boolean;
    onSelectRows?: (selectedKeys: any) => void;
    selectedKeys?: any[];
    checkable?: boolean;
    headers: HeadCell<T>[];
    data: T[];
    pageInfo?: PageInfo;
    onChange?: (params: any) => void;
    orderParams?: OrderParams<T>;
    rowKey?: string | { (record: T): string };
    rowEvents?: {
        onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, record: T) => void;
        onDoubleClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>, record: T) => void;
    }
}) => {
    const [expandRows, setExpandRows] = React.useState<any>([]);
    const onPaginationChange = (e: any, page: number) => {
        onChange({ ...(orderParams || {}), ...(pageInfo || {}), offset: page })
    }
    const onOrderParamsChange = (params: OrderParams<T>) => {
        onChange({ ...params, orderBy: decamelize(String(params.orderBy)), ...(pageInfo || {}), offset: 0 })
    }
    return (
        <TableContainer sx={{ overflowX: 'auto' }} component={Paper}>
            <Table
                stickyHeader
                sx={{ minWidth: '100%' }}
            >
                <ListTableHeader<T>
                    data={data}
                    headers={headers}
                    expandable={expandable}
                    orderParams={{ ...orderParams, orderBy: camelize(orderParams?.orderBy) }}
                    selectedKeys={selectedKeys}
                    checkable={checkable}
                    onSelectRows={onSelectRows}
                    pageInfo={pageInfo}
                    rowKey={rowKey}
                    onOrderChange={(key) => onOrderParamsChange({
                        orderBy: key,
                        order: orderParams.order === 'asc' ? 'desc' : 'asc'
                    })}
                />
                <ListTableBody<T>
                    expandable={expandable}
                    data={data}
                    headers={headers}
                    checkable={checkable}
                    selectedKeys={selectedKeys}
                    onSelectRows={onSelectRows}
                    rowKey={rowKey}
                    expandRows={expandRows}
                    setExpandRows={setExpandRows}
                    rowEvents={rowEvents}
                    expandContent={expandContent}
                />
                {
                    pageInfo?.total && showPaganition ? (
                        <TablePagination
                            rowsPerPageOptions={[pageInfo?.limit]}
                            count={pageInfo?.total}
                            rowsPerPage={pageInfo?.limit}
                            page={pageInfo?.offset}
                            onPageChange={onPaginationChange}
                        />
                    ) : null
                }
            </Table>
        </TableContainer>
    )
}

export default ListTable;
