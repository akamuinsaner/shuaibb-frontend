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


const Customers = () => {
    const {
        curEditRecord,
        createDialogOpen,
        pageInfo,
        selectKeys,
        keyword,
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
            closeCallback: () => listCustomersMutation.mutate({ keyword })
        })
    })
    const createCustomerMutation = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => message.success('添加成功', {
            closeCallback: () => listCustomersMutation.mutate({ keyword })
        })
    })
    const updateCustomerMutation = useMutation({
        mutationFn: updateCustomer,
        onSuccess: () => message.success('修改成功', {
            closeCallback: () => listCustomersMutation.mutate({ keyword })
        })
    })
    const batchDeleteCustomersMutation = useMutation({
        mutationFn: batchDeleteCustomers,
        onSuccess: () => message.success('批量删除成功', {
            closeCallback: () => listCustomersMutation.mutate({ keyword })
        })
    })

    React.useEffect(() => {
        listCustomersMutation.mutate({ keyword })
    }, [])
    return (
        <Box sx={{ padding: '20px' }}>
            <Paper sx={{ padding: '24px', marginBottom: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item sm={3}>
                        <TextField
                            size="small"
                            fullWidth
                            label="姓名或手机号"
                            placeholder='请输入姓名或手机号'
                            value={keyword}
                            onChange={(e) => updateState({ keyword: e.target.value })}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                updateState({ keyword: '' });
                                listCustomersMutation.mutate({})
                            }}
                        >清空搜索条件</Button>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '16px' }}
                            onClick={() => listCustomersMutation.mutate({ keyword })}
                        >搜索</Button>
                    </Grid>
                </Grid>
            </Paper>
            <Stack spacing={2} direction="row-reverse" sx={{ marginBottom: '20px' }}>
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
        </Box>
    )
}

export default React.memo(Customers);