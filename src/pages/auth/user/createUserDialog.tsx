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
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';

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
    const [data, setData] = React.useState<User>({
        mobile: '',
        username: '',
        email: '',
        role: null,
    });
    const [permissionIds , setPermissionIds] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (record) setData(record);
    }, [record])

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>创建群组</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px !important' }}>
                <Stack spacing={2}>
                    <TextField
                        required
                        label="手机号"
                        value={data?.mobile}
                        onChange={e => setData({ ...data, mobile: e.target.value })}
                    />
                    <TextField
                        label="用户名"
                        value={data?.username}
                        onChange={e => setData({ ...data, username: e.target.value  })}
                    />
                    <TextField
                        label="邮箱"
                        value={data?.email}
                        onChange={e => setData({ ...data, email: e.target.value  })}
                    />
                    <TextField
                        select
                        value={data?.role}
                        onChange={(e) => setData({ ...data, role: e.target.value as any })}
                        label="角色"
                    >
                        <MenuItem key={0} value={0}>{ERole[0]}</MenuItem>
                        <MenuItem key={1} value={1}>{ERole[1]}</MenuItem>
                        <MenuItem key={-1} value={-1}>{ERole[-1]}</MenuItem>
                    </TextField>
                    <TextField
                        select
                        SelectProps={{ multiple: true }}
                        label="权限组"
                        value={data?.groups || []}
                        onChange={(e) => setData({ ...data, groups: e.target.value as any })}
                    >
                        {groups.map(group => <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>)}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={close}>取消</Button>
                <Button variant='contained' onClick={() => {
                    close();
                    submit(data);
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreateGroupDialog);
