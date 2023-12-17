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
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { Select } from '@mui/material';

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
    const [name, setName] = React.useState<string>('');
    const [permissionIds , setPermissionIds] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (record) {
            setName(record.name);
            setPermissionIds(record.permissions.map(item => item.id))
        }
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
                        label="群组名称"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Select
                        multiple
                        value={permissionIds}
                        onChange={(e) => setPermissionIds(e.target.value as any)}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => {
                                    const perm = permissions.find(p => `${p.id}` === `${value}`)
                                    return <Chip key={value} label={perm.name} />
                                })}
                            </Box>
                        )}
                    >
                        {permissions.map(perm => (
                            <MenuItem key={perm.id} value={perm.id}>{perm.name}</MenuItem>
                        ))}
                    </Select>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={close}>取消</Button>
                <Button variant='contained' onClick={() => {
                    close();
                    submit({ name, permissionIds, id: record?.id });
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreateGroupDialog);
