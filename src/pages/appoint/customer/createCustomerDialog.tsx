import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Customer } from 'declare/customer';
import useGlobalStore from 'globalStore';
import AvatarUpload from 'components/AvatarUpload';
import { uploadFileCommon } from 'apis/upload';
import { useMutation } from '@tanstack/react-query';
import { message } from 'components/globalMessage';

const CreateCustomerDialog = ({
    open,
    close,
    submit,
    record,
}: {
    open: boolean;
    close: () => void;
    submit: (c: Customer) => void;
    record?: Customer;
}) => {
    const { user } = useGlobalStore(state => state)
    const [data, setData] = React.useState<Customer>({ name: '', phone: '' });

    React.useEffect(() => {
        record && setData(record)
    }, [record])
    const uploadFileMutation = useMutation({
        mutationFn: uploadFileCommon,
        onSuccess: (res) => {
            message.success('上传头像成功');
            setData({ ...data, avatar: res.url })
        }
    })
    console.log(data)
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>创建群组</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px !important' }}>
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    <Box sx={{ width: '150px', height: '150px' }}>
                        <AvatarUpload
                            url={data?.avatar}
                            showLetter={true}
                            letter={(data?.name || '').charAt(0)}
                            onDelete={() => setData({ ...data, avatar: null })}
                            onUpload={file => {
                                const fd = new FormData();
                                fd.append('file', file);
                                fd.append('type', 'avatar');
                                uploadFileMutation.mutate(fd)
                            }}
                        />
                    </Box>
                    <TextField
                        required
                        fullWidth
                        label="客户姓名"
                        value={data?.name}
                        placeholder="请输入客户姓名"
                        onChange={e => setData({ ...data, name: e.target.value })}
                    />
                    <TextField
                        required
                        fullWidth
                        label="手机号"
                        value={data.phone}
                        placeholder="请输入客户手机号"
                        onChange={e => setData({ ...data, phone: e.target.value })}
                    />
                    <TextField
                        rows={5}
                        multiline
                        fullWidth
                        label="客户描述"
                        placeholder='请输入客户描述'
                        value={data.desc}
                        onChange={e => setData({ ...data, desc: e.target.value })}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={close}>取消</Button>
                <Button variant='contained' onClick={() => {
                    close();
                    submit({ ...data, userId: user?.id });
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreateCustomerDialog);
