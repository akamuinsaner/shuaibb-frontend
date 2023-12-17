import React from 'react';
import {
    createGroup,
    updateGroup,
    listGroups,
    deleteGroup,
    batchDeleteGroup,
} from 'apis/auth/group';
import { listPermissions } from 'apis/auth/permission';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from './store';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ListTable from 'components/ListTable';
import Link from '@mui/material/Link';
import { Group } from 'declare/auth';
import Stack from '@mui/material/Stack'
import CreateGroupDialog from './createGroupDialog';
import { confirm } from 'components/confirmDialog';
import { message } from 'components/globalMessage';

const Groups = () => {
    const {
        name,
        selectKeys,
        curEditRecord,
        createDialogOpen,
        groups,
        permissions,
        updateState
    } = useAuthStore(state => state);
    const listGroupsMutation = useMutation({
        mutationFn: listGroups,
        onSuccess: (data) => updateState({ groups: data })
    })
    const createGroupMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: (data) => message.success('创建成功', {
            closeCallback: () => listGroupsMutation.mutate({ name })
        })
    })
    const updateGroupMutation = useMutation({
        mutationFn: updateGroup,
        onSuccess: (data) => message.success('更新成功', {
            closeCallback: () => listGroupsMutation.mutate({ name })
        })
    })
    const deleteGroupMutation = useMutation({
        mutationFn: deleteGroup,
        onSettled: () => message.success('删除成功', {
            closeCallback: () => listGroupsMutation.mutate({ name })
        })
    })
    const batchDeleteGroupMutation = useMutation({
        mutationFn: batchDeleteGroup,
        onSuccess: () => message.success('批量删除成功', {
            closeCallback: () => listGroupsMutation.mutate({ name })
        })
    })
    const listPermissionsMutation = useMutation({
        mutationFn: listPermissions,
        onSuccess: (data) => updateState({ permissions: data })
    })
    React.useEffect(() => {
        listGroupsMutation.mutate({})
        listPermissionsMutation.mutate({})
    }, [])
    return (
        <Box sx={{ padding: '20px' }}>
            <Paper sx={{ padding: '24px', marginBottom: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item sm={3}>
                        <TextField
                            size="small"
                            fullWidth
                            label="群组名称"
                            placeholder='请输入群组名称'
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
                                listGroupsMutation.mutate({})
                            }}
                        >清空搜索条件</Button>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '16px' }}
                            onClick={() => listGroupsMutation.mutate({ name })}
                        >搜索</Button>
                    </Grid>
                </Grid>
            </Paper>
            <Stack spacing={2} direction="row-reverse" sx={{ marginBottom: '20px' }}>
                <Button variant="contained" onClick={() => updateState({ createDialogOpen: true })}>创建群组</Button>
                <Button
                    variant="contained"
                    color='error'
                    disabled={selectKeys.length === 0}
                    onClick={() => {
                        confirm.confirm({
                            title: '删除群组',
                            content: `删除后不可恢复，是否删除群组`,
                            confirmCallback: () => batchDeleteGroupMutation.mutate(selectKeys)
                        })
                    }}
                >删除群组</Button>
            </Stack>
            <ListTable<Group>
                headers={[
                    { id: 'id', label: 'id', type: 'string' },
                    { id: 'name', label: '群组名', type: 'string' },
                    {
                        id: 'permissions',
                        label: '权限',
                        type: 'string',
                        multiLine: true,
                        render: (value, record, index) => (value.map(perm => perm.name).join(','))
                    },
                    {
                        label: '操作',
                        render: (value, record, index) => (
                            <Stack spacing={1} direction="row">
                                <Link onClick={() => updateState({ curEditRecord: record })}>编辑</Link>
                                <Link onClick={() => {
                                    confirm.confirm({
                                        title: '删除群组',
                                        content: `删除后不可恢复，是否删除群组【${record.name}】`,
                                        confirmCallback: () => deleteGroupMutation.mutate(record.id)
                                    })
                                }}>删除</Link>
                            </Stack>
                        )
                    }
                ]}
                rowKey="id"
                data={groups}
                checkable
                selectedKeys={selectKeys}
                onSelectRows={(selectKeys) => updateState({ selectKeys })}
                pageInfo={{
                    total: groups.length,
                    offset: 0,
                    limit: groups.length
                }}
            />
            <CreateGroupDialog
                open={createDialogOpen}
                close={() => updateState({ createDialogOpen: false })}
                permissions={permissions}
                submit={createGroupMutation.mutate}
            />
            <CreateGroupDialog
                open={!!curEditRecord}
                record={curEditRecord}
                close={() => updateState({ curEditRecord: null })}
                permissions={permissions}
                submit={updateGroupMutation.mutate}
            />
        </Box>
    )
}

export default React.memo(Groups);