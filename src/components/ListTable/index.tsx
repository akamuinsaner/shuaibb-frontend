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
import decamelize from 'decamelize';
import Box from '@mui/material/Box';

export interface HeadCell<T> {
    id: keyof T;
    label: string;
    type: 'string' | 'number' | 'array' | 'boolean',
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
}: {
    checkable?: boolean;
    headers: HeadCell<T>[],
    orderParams: OrderParams<T>
    onOrderChange: (key: keyof T) => void;
    selectedKeys?: any[];
    onSelectRows?: (selectedKeys: any) => void;
    pageInfo: PageInfo;
    rowKey?: string;
    data: T[];
}) => {
    const { offset, limit, total } = pageInfo;
    const curRowCount = (offset + 1 * limit) < total ? limit : (total - limit * offset)

    return (
        <TableHead>
            {checkable? <TableCell padding='checkbox'>
                <Checkbox
                    color="primary"
                    checked={selectedKeys.length === curRowCount}
                    indeterminate={selectedKeys.length > 0 && selectedKeys.length < curRowCount}
                    onChange={(e: any) => {
                        if (e.target.checked) {
                            onSelectRows(data.map((item: any) => item[rowKey]))
                        } else {
                            onSelectRows([])
                        }
                    }}
                />
            </TableCell> : null}
            {headers.map((headCell) => {
                return <TableCell
                    key={String(headCell.id)}
                    align={headCell.type === 'number' ? 'right' : 'left'}
                    sortDirection={orderParams.orderBy === headCell.id ? orderParams.order : false}
                >
                    {
                        headCell.type !== 'number' ?
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
    rowKey
}: {
    data: T[];
    headers: HeadCell<T>[],
    checkable?: boolean;
    selectedKeys?: any[];
    onSelectRows?: (selectedKeys: any) => void;
    rowKey?: string;
}) => {
    return (
        <TableBody>
            {data.map((row: any, index) => {
                return (
                    <TableRow
                        sx={{ cursor: 'pointer' }}
                        tabIndex={-1}
                    >
                        {checkable ? <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                checked={selectedKeys.includes(row[rowKey])}
                                onClick={(e: any) => {
                                    if (e.target.checked) {
                                        onSelectRows([...selectedKeys, row[rowKey]])
                                    } else {
                                        onSelectRows(selectedKeys.filter(item => item !== row[rowKey]))
                                    }
                                }}
                            />
                        </TableCell> : null}
                        {headers.map((headCell, cIndex) => {
                            const render = headCell.render;
                            let renderText = row[String(headCell.id)];
                            if (render) {
                                renderText = render(renderText, row, index)
                            }
                            return <TableCell
                                id={String(headCell.id)}
                                key={String(headCell.id)}
                                align={headCell.type === 'number' ? 'right' : 'left'}
                            >
                                {renderText}
                            </TableCell>
                        })}
                    </TableRow>
                )
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
    rowKey
}: {
    onSelectRows?: (selectedKeys: any) => void;
    selectedKeys?: any[];
    checkable?: boolean;
    headers: HeadCell<T>[];
    data: T[];
    pageInfo: PageInfo;
    onChange: (params: any) => void;
    orderParams?: OrderParams<T>;
    rowKey?: string;
}) => {
    const onPaginationChange = (e: any, page: number) => {
        onChange({ ...orderParams, ...pageInfo, offset: page })
    }
    const onOrderParamsChange = (params: OrderParams<T>) => {
        console.log(params)
        onChange({ ...params, orderBy: decamelize(String(params.orderBy)), ...pageInfo, offset: 0 })
    }
    return (
        <TableContainer component={Paper}>
            <Table
                sx={{ minWidth: '100%' }}
            >
                <ListTableHeader<T>
                    data={data}
                    headers={headers}
                    orderParams={orderParams}
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
                    data={data}
                    headers={headers}
                    checkable={checkable}
                    selectedKeys={selectedKeys}
                    onSelectRows={onSelectRows}
                    rowKey={rowKey}
                />
                {
                    pageInfo.total ? (
                        <TablePagination
                            rowsPerPageOptions={[pageInfo.limit]}
                            count={pageInfo.total}
                            rowsPerPage={pageInfo.limit}
                            page={pageInfo.offset}
                            onPageChange={onPaginationChange}
                        />
                    ) : null
                }
            </Table>
        </TableContainer>
    )
}

export default ListTable;
