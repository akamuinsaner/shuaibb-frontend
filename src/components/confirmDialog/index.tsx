import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import type { AlertColor } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';

const ConfirmDialog = () => {
    const [title, setTitle] = React.useState<string>('');
    const [content, setContent] = React.useState('');
    const [isOpen, setOpen] = React.useState<boolean>(false);
    const [severity, setSeverity] = React.useState<AlertColor | 'confirm'>("info");
    const closeFuncRef = React.useRef(null);
    const confirmFucRef = React.useRef(null);
    const commonMsgFunc = (severity: AlertColor | 'confirm'): cb => {
        return ({ title, content, closeCallback, confirmCallback }) => {
            setOpen(true);
            setSeverity(severity);
            setTitle(title);
            setContent(content);
            if (closeCallback) closeFuncRef.current = closeCallback
            if (confirmCallback) confirmFucRef.current = confirmCallback
        };
    }
    React.useEffect(() => {
        confirm.info = commonMsgFunc('info')
        confirm.warning = commonMsgFunc('warning')
        confirm.success = commonMsgFunc('success')
        confirm.error = commonMsgFunc('error')
        confirm.confirm = commonMsgFunc('confirm')
    }, [])
    const closeDialog = () => {
        if (closeFuncRef.current) closeFuncRef.current();
        setOpen(false)
    }
    const confirmDialog = () => {
        if (confirmFucRef.current) confirmFucRef.current();
        setOpen(false)
    }
    const getIcon = React.useCallback(() => {
        if (severity === 'confirm') return '';
        if (severity === 'success') return <CheckCircleIcon color="success" />
        if (severity === 'info') return <CheckCircleIcon color="info" />
        if (severity === 'warning') return <CheckCircleIcon color="warning" />
        if (severity === 'error') return <CheckCircleIcon color="error" />
    }, [severity]);
    return (
        <Dialog
            open={isOpen}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle
                sx={{ display: 'flex', alignItems: 'center' }}
            >{`${getIcon()}${title}`}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                {severity === 'confirm' ? (
                    <>
                        <Button variant='text' onClick={closeDialog}>取消</Button>
                        <Button variant='contained' onClick={confirmDialog}>确定</Button>
                    </>
                ) : (
                    <Button variant='contained' onClick={closeDialog}>知道了</Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

type cb = ({
    title,
    content,
    closeCallback,
    confirmCallback
}?: {
    title: any,
    content: any,
    closeCallback?: () => void;
    confirmCallback?: () => void
}) => void

export class confirm {
    static info: cb
    static warning: cb
    static success: cb
    static error: cb
    static confirm: cb
}

export default React.memo(ConfirmDialog)
