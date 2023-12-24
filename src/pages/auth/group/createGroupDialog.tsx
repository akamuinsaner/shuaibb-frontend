import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Group, Permission } from 'declare/auth';
import MenuItem from '@mui/material/MenuItem';
import { Form } from 'components/FormValidator';

const CreateGroupDialog = ({
    open,
    close,
    permissions,
    submit,
    record
}: {
    open: boolean;
    close: () => void;
    permissions: Permission[];
    submit: (group: Group) => void;
    record?: Group;
}) => {

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>创建群组</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px !important' }}>
                <Stack spacing={2}>
                    <Form
                        initialValues={!record ? null : {
                            name: record.name,
                            permissionIds: record.permissions.map(item => item.id)
                        }}
                    >
                        <Form.Item
                            name="name"
                            rules={[
                                { required: true, msg: '请输入群组名称' }
                            ]}
                        >
                            <TextField
                                required
                                label="群组名称"
                                placeholder='请输入群组名称'
                            />
                        </Form.Item>
                        <Form.Item
                            name="permissionIds"
                            multiple
                        >
                            <TextField
                                label="权限"
                                placeholder='请选择权限'
                                select
                                SelectProps={{
                                    multiple: true,
                                }}
                            >
                                {permissions.map(perm => (
                                    <MenuItem key={perm.id} value={perm.id}>{perm.name}</MenuItem>
                                ))}
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
                            submit({ ...values, id: record?.id });
                        }
                    })

                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreateGroupDialog);
