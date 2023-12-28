import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SampleLabel } from 'declare/sample';
import { Form } from 'components/FormValidator';
import { STANDARD_NAME } from 'common/rexps';
import Stack from '@mui/material/Stack';
import TreeSelect from 'components/TreeSelect';

const CreateLabelDialog = ({
    open,
    close,
    record,
    labels,
    submit
}: {
    open: boolean;
    close: () => void;
    record?: SampleLabel;
    labels: SampleLabel[];
    submit: (v: any) => void;
}) => {

    return (
        <Dialog
            open={open}
            onClose={close}
            fullWidth
            maxWidth="sm"
        >
            <Form
                initialValues={record}
                submit={(values) => {
                    submit({
                        ...values,
                        id: record?.id,
                        parentId: values.parentId || null
                    });
                    close();
                }}
            >
                <DialogTitle>{record ? '编辑标签' : '新建标签'}</DialogTitle>
                <DialogContent sx={{ paddingTop: '20px !important' }}>
                    <Stack direction="column" spacing={2}>
                        <Form.Item
                            name="parentId"
                        >
                            <TreeSelect<SampleLabel>
                                options={labels}
                                fullWidth
                                size="small"
                                label="上级标签"
                            />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            rules={[
                                { required: true, msg: '请输入标签名称' },
                                { regex: STANDARD_NAME, msg: '请输入1-20位的字符' }
                            ]}
                        >
                            <TextField label="标签名称" />
                        </Form.Item>
                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={close}>取消</Button>
                    <Form.Submit>
                        <Button variant="contained">确定</Button>
                    </Form.Submit>
                </DialogActions>
            </Form>

        </Dialog>
    )
}

export default React.memo(CreateLabelDialog);