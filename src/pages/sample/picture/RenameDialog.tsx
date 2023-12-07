import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'

const RenameDialog = ({
    open,
    close,
    defaultName,
    type,
    onSubmit
}: {
    open: boolean,
    close: () => void;
    defaultName: string;
    type: 'pic' | 'folder';
    onSubmit: (name: string) => void;
}) => {
    const [name, setName] = React.useState('');
    React.useEffect(() => {
        if (open) setName(defaultName)
    }, [open]);
    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>重命名</DialogTitle>
            <DialogContent
                sx={{ padding: '24px !important' }}
            >
                <TextField
                    label={type === 'pic' ? "文件名称" : '文件夹名称'}
                    placeholder='请输入文件名'
                    value={name}
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={close}
                >取消</Button>
                <Button
                    variant='contained'
                    sx={{ marginLeft: '16px' }}
                    onClick={() => onSubmit(name)}
                >确定</Button>
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(RenameDialog);
