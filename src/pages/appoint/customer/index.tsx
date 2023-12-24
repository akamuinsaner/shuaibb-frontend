import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useCustomerStore } from './store';
import {
    listCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    batchDeleteCustomers
} from 'apis/customer';
import { useMutation } from '@tanstack/react-query';
import { Customer } from 'declare/customer';
import ListTable from 'components/ListTable';
import Stack from '@mui/material/Stack';
import { confirm } from 'components/confirmDialog';
import { message } from 'components/globalMessage';
import Link from '@mui/material/Link';
import CreateCustomerDialog from './createCustomerDialog';
import FilterFields from 'components/FilterFields';

const Customers = () => {
    const {
        curEditRecord,
        createDialogOpen,
        pageInfo,
        selectKeys,
        filterParams,
        customers,
        updateState
    } = useCustomerStore(state => state);
    const listCustomersMutation = useMutation({
        mutationFn: listCustomers,
        onSuccess: (data) => updateState({
            selectKeys: [],
            pageInfo: { ...pageInfo, offset: 0, total: data.length },
            customers: data
        })
    })
    const deleteCustomerMutation = useMutation({
        mutationFn: deleteCustomer,
        onSettled: () => message.success('删除成功', {
            closeCallback: () => listCustomersMutation.mutate(filterParams)
        })
    })
    const createCustomerMutation = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => message.success('添加成功', {
            closeCallback: () => listCustomersMutation.mutate(filterParams)
        })
    })
    const updateCustomerMutation = useMutation({
        mutationFn: updateCustomer,
        onSuccess: () => message.success('修改成功', {
            closeCallback: () => listCustomersMutation.mutate(filterParams)
        })
    })
    const batchDeleteCustomersMutation = useMutation({
        mutationFn: batchDeleteCustomers,
        onSuccess: () => message.success('批量删除成功', {
            closeCallback: () => listCustomersMutation.mutate(filterParams)
        })
    })

    React.useEffect(() => {
        listCustomersMutation.mutate(filterParams)
    }, [])
    return (
        <Stack sx={{ padding: '20px' }} spacing={2}>
            <FilterFields
                configs={[{ key: 'keyword', label: '姓名或手机号', placeholder: '请输入姓名或手机号' }]}
                data={{ ...filterParams }}
                onChange={(key, value) => updateState({ filterParams: { ...filterParams, [key]: value } })}
                reset={() => {
                    updateState({ filterParams: {} });
                    listCustomersMutation.mutate({});
                }}
                search={() => listCustomersMutation.mutate(filterParams)}
            />
            <Stack spacing={2} direction="row-reverse">
                <Button variant="contained" onClick={() => updateState({ createDialogOpen: true })}>添加客户</Button>
                <Button
                    variant="contained"
                    color='error'
                    disabled={selectKeys.length === 0}
                    onClick={() => {
                        confirm.confirm({
                            title: '删除客户',
                            content: `删除后不可恢复，是否删除客户`,
                            confirmCallback: () => batchDeleteCustomersMutation.mutate(selectKeys)
                        })
                    }}
                >删除客户</Button>
            </Stack>
            <ListTable<Customer>
                headers={[
                    { id: 'id', label: 'id', type: 'string' },
                    { id: 'avatar', label: '头像', type: 'string', render: (value, record, index) => {
                        return value ? <img
                            src={value}
                            style={{ width: '40px', height: '40px', borderRadius: '100%' }}
                        /> : ''
                    } },
                    { id: 'name', label: '姓名', type: 'string' },
                    { id: 'phone', label: '电话', type: 'string' },
                    { id: 'desc', label: '描述', type: 'string' },
                    {
                        label: '操作',
                        render: (value, record, index) => (
                            <Stack spacing={1} direction="row">
                                <Link onClick={() => updateState({ curEditRecord: record })}>编辑</Link>
                                <Link onClick={() => {
                                    confirm.confirm({
                                        title: '删除客户',
                                        content: `删除后不可恢复，是否删除客户【${record.name}】`,
                                        confirmCallback: () => deleteCustomerMutation.mutate(record.id)
                                    })
                                }}>删除</Link>
                            </Stack>
                        )
                    }
                ]}
                rowKey="id"
                data={customers}
                checkable
                selectedKeys={selectKeys}
                onSelectRows={(selectKeys) => updateState({ selectKeys })}
                pageInfo={pageInfo}
            />
            <CreateCustomerDialog
                open={createDialogOpen}
                close={() => updateState({ createDialogOpen: false })}
                submit={createCustomerMutation.mutate}
            />
            <CreateCustomerDialog
                open={!!curEditRecord}
                close={() => updateState({ curEditRecord: null })}
                submit={updateCustomerMutation.mutate}
                record={curEditRecord}
            />
        </Stack>
    )
}

export default React.memo(Customers);