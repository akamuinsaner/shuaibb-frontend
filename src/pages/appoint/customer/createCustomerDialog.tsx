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
import { Form } from 'components/FormValidator';
import { FormItem } from 'components/FormValidator/item';
import { MOBILE_REXP } from 'common/rexps';

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
    const [name, setName] = React.useState<string>('');
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>创建群组</DialogTitle>
            <DialogContent sx={{ paddingTop: '20px !important' }}>
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    <Form initialValues={record}>
                        <FormItem
                            name="avatar"
                        >
                            <AvatarUpload
                                showLetter={true}
                                letter={name.charAt(0)}
                                onDelete={() => Form.setValues({ avatar: null })}
                            />
                        </FormItem>
                        <FormItem
                            name="name"
                            rules={[
                                { required: true, msg: '请输入客户姓名' }
                            ]}
                        >
                            <TextField
                                required
                                fullWidth
                                label="客户姓名"
                                placeholder="请输入客户姓名"
                            />
                        </FormItem>
                        <FormItem
                            name="phone"
                            rules={[
                                { required: true, msg: '请输入客户手机号' },
                                { regex: MOBILE_REXP, msg: '请输入正确的手机号格式' }
                            ]}
                        >
                            <TextField
                                required
                                fullWidth
                                label="手机号"
                                placeholder="请输入客户手机号"
                            />
                        </FormItem>
                        <FormItem
                            name="desc"
                        >
                            <TextField
                                rows={5}
                                multiline
                                fullWidth
                                label="客户描述"
                                placeholder='请输入客户描述'
                            />
                        </FormItem>
                    </Form>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={close}>取消</Button>
                <Button variant='contained' onClick={() => {
                    Form.validates((errors, values) => {
                        console.log(errors, values)
                        if (!errors) {
                            close();
                            submit({ ...values, userId: user?.id, id: record?.id });
                        }
                    })
                }}>确定</Button>
            </DialogActions>
        </Dialog >
    )
}

export default React.memo(CreateCustomerDialog);
