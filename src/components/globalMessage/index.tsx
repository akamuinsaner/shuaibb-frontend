import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material';
import { SnackbarProps } from '@mui/base';

const GlobalMessage = ({

}) => {
    const [isOpen, setOpen] = React.useState<boolean>(false);
    const [severity, setSeverity] = React.useState<AlertColor>("info");
    const [content, setContent] = React.useState<string>("");
    const [duration, setDuration] = React.useState<number>(2000);
    const [closeFunc, setCloseFunc] = React.useState<any>(null)

    const commonMsgFunc = (severity: AlertColor): cb => {
        return (msg, { duration, closeCallback }) => {
            setOpen(true);
            setSeverity(severity);
            setContent(msg);
            if (duration) setDuration(duration)
            if (closeCallback) setCloseFunc(closeCallback)
        };
    }
    const onClose: SnackbarProps["onClose"] = (event, reason) => {
        setOpen(false);
        if (reason === 'timeout') {
            if (closeFunc) closeFunc();
        }
    }
    React.useEffect(() => {
        message.info = commonMsgFunc('info')
        message.warning = commonMsgFunc('warning')
        message.success = commonMsgFunc('success')
        message.error = commonMsgFunc('error')
    }, [])
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={isOpen}
            autoHideDuration={duration}
            onClose={onClose}>
            <Alert severity={severity} sx={{ width: '100%' }}>
                {content}
            </Alert>
        </Snackbar>
    )
}

type cb = (msg: string, {
    duration,
    closeCallback
}?: {
    duration?: number;
    closeCallback?: () => void
}) => void

export class message {
    static info: cb
    static warning: cb
    static success: cb
    static error: cb
}

export default React.memo(GlobalMessage);