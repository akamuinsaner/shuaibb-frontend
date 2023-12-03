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
    onOrderChange
}: {
    headers: HeadCell<T>[],
    orderParams: OrderParams<T>
    onOrderChange: (key: keyof T) => void
}) => {

    return (
        <TableHead>
            <TableCell padding='checkbox'>
                <Checkbox
                    color="primary"
                />
            </TableCell>
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
    headers
}: {
    data: T[];
    headers: HeadCell<T>[],
}) => {
    return (
        <TableBody>
            {data.map((row: any, index) => {
                return (
                    <TableRow
                        sx={{ cursor: 'pointer' }}
                        tabIndex={-1}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                            />
                        </TableCell>
                        {headers.map((headCell, cIndex) => {
                            const render = headCell.render;
                            let renderText = row[String(headCell.id)];
                            if (render) {
                                renderText = render(renderText, row, index)
                            }
                            return <TableCell
                                id={String(headCell.id)}
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
    orderParams
}: {
    headers: HeadCell<T>[],
    data: T[],
    pageInfo: PageInfo,
    onChange: (params: any) => void,
    orderParams: OrderParams<T>
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
                    headers={headers}
                    orderParams={orderParams}
                    onOrderChange={(key) => onOrderParamsChange({
                        orderBy: key,
                        order: orderParams.order === 'asc' ? 'desc' : 'asc'
                    })}
                />
                <ListTableBody<T>
                    data={data}
                    headers={headers}
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
