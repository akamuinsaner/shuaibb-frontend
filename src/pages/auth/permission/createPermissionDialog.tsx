import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Permission } from 'declare/auth';
import { Form } from 'components/FormValidator';

const CreatePermissionDialog = ({
    open,
    close,
    submit,
    record,
    types
}: {
    open: boolean;
    close: () => void;
    submit: (group: Permission) => void;
    record?: Permission;
    types: any[]
}) => {
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{record ? '编辑权限' : '新增权限'}</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px !important' }}>
                <Stack spacing={2}>
                    <Form initialValues={record}>
                        <Form.Item
                            name="chineseName"
                            rules={[
                                { required: true, msg: '请输入权限名称' }
                            ]}
                        >
                            <TextField required label="权限名称" />
                        </Form.Item>
                        <Form.Item
                            name="codename"
                            rules={[
                                { required: true, msg: '请输入权限代码' }
                            ]}
                        >
                            <TextField required label="权限代码" />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            rules={[
                                { required: true, msg: '请输入权限描述' }
                            ]}
                        >
                            <TextField required label="权限描述" />
                        </Form.Item>
                        <Form.Item
                            name="contentType"
                            rules={[
                                { required: true, msg: '请选择所属内容' }
                            ]}
                        >
                            <TextField
                                required
                                label="所属内容"
                                select
                            >
                                {types.map(type => {
                                    return <MenuItem
                                        key={type.id} value={type.id}
                                    >{type.appLabel}.{type.model}</MenuItem>
                                })}
                            </TextField>
                        </Form.Item>

                    </Form>


                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={close}>取消</Button>
                <Button variant='contained' onClick={() => {
                    Form.validates((errors, values) => {
                        if (!errors) {
                            close();
                            submit({ ...values, id: record?.id })
                        }
                    })
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreatePermissionDialog);
