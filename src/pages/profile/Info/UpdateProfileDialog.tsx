import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Form } from 'components/FormValidator';
import TextField from '@mui/material/TextField';
import { User } from 'declare/user';
import { STANDARD_NAME } from 'common/rexps';
import CascadeSelect from 'components/CascadeSelect';

const UpdateProfileDialog = ({
    open,
    close,
    userInfo,
    submit,
    areaList
}: {
    open: boolean;
    close: () => void;
    userInfo: User;
    submit: (data: Partial<User>) => void;
    areaList: any[]
}) => {

    return (
        <Dialog
            open={open}
            onClose={close}
            maxWidth="sm"
            fullWidth
        >
            <Form
                initialValues={{
                    ...userInfo,
                    region: userInfo.region && JSON.parse(userInfo.region)
                }}
                submit={(values) => {
                    submit({
                        ...values,
                        id: userInfo.id,
                        region: values.region && JSON.stringify(values.region),
                    });
                    close();
                }}
            >
                <DialogTitle>更新资料</DialogTitle>
                <DialogContent sx={{ padding: '20px !important' }}>
                    <Stack direction="column" spacing={2}>

                        <Form.Item
                            name="nickname"
                            rules={[{ regex: STANDARD_NAME, msg: '请输入标准格式的昵称（1-20）' }]}
                        >
                            <TextField label="昵称" />
                        </Form.Item>
                        <Form.Item
                            name="signature"
                        >
                            <TextField label="个性签名" />
                        </Form.Item>
                        <Form.Item
                            name="region"
                        >
                            <CascadeSelect
                                multiple={false}
                                options={areaList}
                            />
                        </Form.Item>
                        <Form.Item
                            name="address"
                        >
                            <TextField
                                label="详细地址"
                                multiline
                                rows={5}
                            />
                        </Form.Item>
                        <Form.Item
                            name="introduction"
                        >
                            <TextField
                                label="简介"
                                multiline
                                rows={5}
                            />
                        </Form.Item>

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={close}>取消</Button>
                    <Form.Submit><Button variant='contained'>确定</Button></Form.Submit>
                </DialogActions>
            </Form>
        </Dialog >
    )
}

export default React.memo(UpdateProfileDialog);
