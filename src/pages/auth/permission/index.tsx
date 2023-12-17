import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { usePermissionStore } from './store';
import { Permission } from 'declare/auth';
import ListTable from 'components/ListTable';
import Link from '@mui/material/Link';
import { confirm } from 'components/confirmDialog';
import { message } from 'components/globalMessage';
import {
    listPermissions,
    createPermissions,
    updatePermissions,
    deletePermissions,
    batchDeletePermission,
    listContentTypes
} from 'apis/auth/permission';
import { useQuery, useMutation } from '@tanstack/react-query';
import CreatePermissionDialog from './createPermissionDialog';

const Permissions = () => {
    const {
        updateState,
        name,
        selectKeys,
        permissions,
        curEditRecord,
        createDialogOpen,
        pageInfo,
    } = usePermissionStore(state => state)
    const { data: contentTypes = [] } = useQuery({ queryFn: listContentTypes, queryKey: ['listContentTypes'] })
    const listPermissionsMutation = useMutation({
        mutationFn: listPermissions,
        onSuccess: (data) => updateState({ 
            permissions: data,
            selectKeys: [],
            pageInfo: { ...pageInfo, total: data.length, offset: 0 }
        })
    })
    const createPermissionMutation = useMutation({
        mutationFn: createPermissions,
        onSuccess: (data) => message.success('创建成功', {
            closeCallback: () => listPermissionsMutation.mutate({ name })
        })
    })
    const updatePermissionMutation = useMutation({
        mutationFn: updatePermissions,
        onSuccess: (data) => message.success('更新成功', {
            closeCallback: () => listPermissionsMutation.mutate({ name })
        })
    })
    const deletePermissionMutation = useMutation({
        mutationFn: deletePermissions,
        onSettled: (data) => message.success('删除成功', {
            closeCallback: () => listPermissionsMutation.mutate({ name })
        })
    })
    const batchDeletePermissionMutation = useMutation({
        mutationFn: batchDeletePermission,
        onSuccess: (data) => message.success('批量删除成功', {
            closeCallback: () => listPermissionsMutation.mutate({ name })
        })
    })
    React.useEffect(() => {
        listPermissionsMutation.mutate({ name })
    }, [])
    return (
        <Box sx={{ padding: '20px' }}>
            <Paper sx={{ padding: '24px', marginBottom: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item sm={3}>
                        <TextField
                            size="small"
                            fullWidth
                            label="权限名称"
                            placeholder='请输入权限名称'
                            value={name}
                            onChange={(e) => updateState({ name: e.target.value })}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                updateState({ name: '' });
                                listPermissionsMutation.mutate({});
                            }}
                        >清空搜索条件</Button>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '16px' }}
                            onClick={() => listPermissionsMutation.mutate({ name })}
                        >搜索</Button>
                    </Grid>
                </Grid>
            </Paper>
            <Stack spacing={2} direction="row-reverse" sx={{ marginBottom: '20px' }}>
                <Button variant="contained" onClick={() => updateState({ createDialogOpen: true })}>新增权限</Button>
                <Button
                    variant="contained"
                    color='error'
                    disabled={!selectKeys.length}
                    onClick={() => {
                        confirm.confirm({
                            title: '删除权限',
                            content: `删除后不可恢复，是否删除权限`,
                            confirmCallback: () => batchDeletePermissionMutation.mutate(selectKeys)
                        })
                    }}
                >删除权限</Button>
            </Stack>
            <ListTable<Permission>
                headers={[
                    { id: 'id', label: 'id', type: 'string' },
                    { id: 'codename', label: '权限代码', type: 'string' },
                    { id: 'chineseName', label: '权限名称', type: 'string' },
                    { id: 'name', label: '权限描述', type: 'string' },
                    {
                        label: '操作',
                        render: (value, record, index) => (
                            <Stack spacing={1} direction="row">
                                <Link onClick={() => updateState({ curEditRecord: record })}>编辑</Link>
                                <Link onClick={() => {
                                    confirm.confirm({
                                        title: '删除权限',
                                        content: `删除后不可恢复，是否删除权限【${record.chineseName}】`,
                                        confirmCallback: () => deletePermissionMutation.mutate(record.id)
                                    })
                                }}>删除</Link>
                            </Stack>
                        )
                    }
                ]}
                rowKey="id"
                data={permissions.filter((item, index) => 
                    ((index >= pageInfo.offset * pageInfo.limit) && index < (pageInfo.offset + 1) * pageInfo.limit))}
                checkable
                selectedKeys={selectKeys}
                onSelectRows={(selectKeys) => updateState({ selectKeys })}
                pageInfo={pageInfo}
            />
            <CreatePermissionDialog
                open={createDialogOpen}
                close={() => updateState({ createDialogOpen: false })}
                submit={createPermissionMutation.mutate}
                types={contentTypes}
            />
            <CreatePermissionDialog
                open={!!curEditRecord}
                close={() => updateState({ curEditRecord: null })}
                record={curEditRecord}
                submit={updatePermissionMutation.mutate}
                types={contentTypes}
            />
        </Box>
    )
}

export default React.memo(Permissions);
