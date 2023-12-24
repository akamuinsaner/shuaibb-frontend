import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useUsersStore } from './store';
import ListTable from 'components/ListTable';
import Link from '@mui/material/Link';
import { confirm } from 'components/confirmDialog';
import { message } from 'components/globalMessage';
import MenuItem from '@mui/material/MenuItem';
import { User, ERole } from 'declare/user';
import {
    listUsers,
    createUser,
    updateUser,
    deleteUser
} from 'apis/auth/user';
import {
    listGroups
} from 'apis/auth/group'
import { useMutation, useQuery } from '@tanstack/react-query';
import CreateUserDialog from './createUserDialog';
import FilterFields from 'components/FilterFields';

const Users = () => {
    const {
        filterParams,
        users,
        createDialogOpen,
        curEditRecord,
        selectKeys,
        pageInfo,
        updateState
    } = useUsersStore(state => state);
    const { data: groups = [] } = useQuery({ queryFn: listGroups, queryKey: ['listGroups'] })
    const listUsersMutation = useMutation({
        mutationFn: listUsers,
        onSuccess: (data) => updateState({
            selectKeys: [],
            users: data,
            pageInfo: { ...pageInfo, offset: 0, total: data.length }
        })
    });
    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: (data) => message.success('创建成功', {
            closeCallback: () => listUsersMutation.mutate(filterParams)
        })
    });
    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => message.success('更新成功', {
            closeCallback: () => listUsersMutation.mutate(filterParams)
        })
    })
    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSettled: (data, error) => {
            message.success('删除成功', {
                closeCallback: () => listUsersMutation.mutate(filterParams)
            })
        }
    })
    React.useEffect(() => {
        listUsersMutation.mutate(filterParams);
    }, [])
    return (
        <Stack spacing={2} sx={{ padding: '20px' }}>
            <FilterFields
                reset={() => {
                    updateState({ filterParams: {} });
                    listUsersMutation.mutate({});
                }}
                search={() => listUsersMutation.mutate(filterParams)}
                data={filterParams}
                onChange={(key, value) => updateState({ filterParams: { ...filterParams, [key]: value } })}
                configs={[
                    { key: 'name', label: '用户名/邮箱/手机号' },
                    { key: 'roles', label: '角色', type: 'select',
                        selectProps: {
                            options: Object.keys(ERole).filter(k => isNaN(Number(k))).map(name => ({ name, id: ERole[name] })),
                            multiple: true, labelField: 'name', valueField: 'id' },
                    }
                ]}
            />
            <Stack spacing={2} direction="row-reverse">
                <Button variant="contained" onClick={() => updateState({ createDialogOpen: true })}>新增用户</Button>
                <Button
                    variant="contained"
                    color='error'
                    disabled={!selectKeys.length}
                    onClick={() => {
                        confirm.confirm({
                            title: '删除用户',
                            content: `删除后不可恢复，是否删除用户`,
                            confirmCallback: () => { }
                        })
                    }}
                >删除用户</Button>
            </Stack>
            <ListTable<User>
                headers={[
                    { id: 'id', label: 'id', type: 'string' },
                    { id: 'username', label: '用户名', type: 'string' },
                    { id: 'mobile', label: '手机号', type: 'string' },
                    { id: 'email', label: '邮箱', type: 'string' },
                    { id: 'role', label: '角色', type: 'string', render: (value) => ERole[value] },
                    { id: 'groups', label: '权限组', type: 'string', render: (value) => value && value.map(v => v.name).join(',') },
                    {
                        label: '操作',
                        render: (value, record, index) => (
                            <Stack spacing={1} direction="row">
                                <Link onClick={() => updateState({ curEditRecord: record })}>编辑</Link>
                                <Link onClick={() => {
                                    confirm.confirm({
                                        title: `删除${ERole[record.role]}${record.showName}`,
                                        content: `删除后不可恢复，是否删除【${ERole[record.role]}】【${record.showName}】`,
                                        confirmCallback: () => deleteUserMutation.mutate(record.id)
                                    })
                                }}>删除</Link>
                            </Stack>
                        )
                    }
                ]}
                rowKey="id"
                data={users.filter((item, index) =>
                    ((index >= pageInfo.offset * pageInfo.limit) && index < (pageInfo.offset + 1) * pageInfo.limit))}
                checkable
                selectedKeys={selectKeys}
                onSelectRows={(selectKeys) => updateState({ selectKeys })}
                pageInfo={pageInfo}
            />
            <CreateUserDialog
                open={createDialogOpen}
                close={() => updateState({ createDialogOpen: false })}
                submit={createUserMutation.mutate}
                groups={groups}
            />
            <CreateUserDialog
                open={!!curEditRecord}
                close={() => updateState({ curEditRecord: null })}
                submit={updateUserMutation.mutate}
                record={curEditRecord}
                groups={groups}
            />
        </Stack>
    )
}

export default React.memo(Users);
