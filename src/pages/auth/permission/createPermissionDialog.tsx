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
    const [data, setData] = React.useState<Permission>(null);
    React.useEffect(() => {
        if (record) {
            setData(record);
        }
    }, [record])

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{record ? '编辑权限' : '新增权限'}</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px !important' }}>
                <Stack spacing={2}>
                    <TextField
                        required
                        label="权限名称"
                        value={data?.chineseName}
                        onChange={e => setData({ ...data, chineseName: e.target.value })}
                    />
                    <TextField
                        required
                        label="权限代码"
                        value={data?.codename}
                        onChange={e => setData({ ...data, codename: e.target.value })}
                    />
                    <TextField
                        required
                        label="权限描述"
                        value={data?.name}
                        onChange={e => setData({ ...data, name: e.target.value })}
                    />
                    <TextField
                        required
                        label="所属内容"
                        select
                        value={data?.contentType}
                        onChange={e => setData({ ...data, contentType: e.target.value as any })}
                    >
                        {types.map(type => {
                            return <MenuItem
                                key={type.id} value={type.id}
                            >{type.appLabel}.{type.model}</MenuItem>
                        })}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={close}>取消</Button>
                <Button variant='contained' onClick={() => {
                    close();
                    submit(data)
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreatePermissionDialog);
