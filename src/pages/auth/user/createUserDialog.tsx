import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { User, ERole } from 'declare/user';
import { Group, Permission } from 'declare/auth';
import { MOBILE_REXP, EMAIL_REXP } from 'common/rexps';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';
import { Form } from 'components/FormValidator';

const CreateGroupDialog = ({
    open,
    close,
    submit,
    record,
    groups
}: {
    open: boolean;
    close: () => void;
    submit: (user: User) => void;
    record?: User;
    groups: Group[]
}) => {
    const [permissionIds, setPermissionIds] = React.useState<number[]>([]);

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>创建用户</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px !important' }}>
                <Stack spacing={2}>
                    <Form initialValues={record? {
                        ...record, groups: record.groups.map(item => item.id)
                    } : null}>
                        <Form.Item
                            name="mobile"
                            rules={[
                                { required: true, msg: '请输入手机号' },
                                { regex: MOBILE_REXP, msg: '请输入正确的手机号格式' }
                            ]}
                        >
                            <TextField required label="手机号" />
                        </Form.Item>
                        <Form.Item
                            name="username"
                        >
                            <TextField label="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { regex: EMAIL_REXP, msg: '请输入正确的邮箱格式' }
                            ]}
                        >
                            <TextField label="邮箱" />
                        </Form.Item>
                        <Form.Item
                            name="role"
                        >
                            <TextField
                                select
                                label="角色"
                            >
                                <MenuItem key={0} value={0}>{ERole[0]}</MenuItem>
                                <MenuItem key={1} value={1}>{ERole[1]}</MenuItem>
                                <MenuItem key={-1} value={-1}>{ERole[-1]}</MenuItem>
                            </TextField>
                        </Form.Item>
                        <Form.Item
                            name="groups"
                            multiple
                        >
                            <TextField
                                select
                                SelectProps={{ multiple: true }}
                                label="权限组"
                            >
                                {groups.map(group => <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>)}
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
