import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Form } from 'components/FormValidator';

const AddVideoDialog = ({
    open,
    close,
}: {
    open: boolean;
    close: () => void;
}) => {
    return (
        <Dialog
            open={open}
            onClose={close}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>添加视频外链</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <Form>
                        <Form.Item
                            name="link"
                            rules={[{ required: true, msg: '请填写视频链接' }]}
                        >
                            <TextField label="链接" />
                        </Form.Item>
                    </Form>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}