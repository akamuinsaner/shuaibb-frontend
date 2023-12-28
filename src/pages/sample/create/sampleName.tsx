import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { SampleData } from 'declare/sample';
import { SampleLabel } from 'declare/sample';
import MenuItem from '@mui/material/MenuItem';
import { Form } from 'components/FormValidator';
import { NAME_REXP } from 'common/rexps';
import CoverComp from './CoverComp';
import DetailComp from './DetailComp';
import CascadeSelect from 'components/CascadeSelect';

const SampleName = React.forwardRef(({
    labels = []
}: {
    labels: SampleLabel[]
}, ref: any) => {
    return (
        <Item elevation={3} ref={ref}>
            <Stack spacing={2}>
                <Typography>样片名称</Typography>
                <Form.Item
                    name="name"
                    rules={[
                        { required: true, msg: '请输入样片名称' },
                        { regex: NAME_REXP, msg: '请输入20位以内的字符' }
                    ]}
                >
                    <TextField
                        required
                        fullWidth
                        label="样片名称"
                        placeholder='请输入样片名称'
                        size='small'
                    />
                </Form.Item>
                <Form.Item
                    name="tagIds"
                >
                    <CascadeSelect
                        label="样片标签"
                        placeholder='请选择样片标签'
                        multiple
                        options={labels.filter(l => !l.parentId)}
                    />
                </Form.Item>
                <Form.Item
                    name="desc"
                >
                    <TextField
                        fullWidth
                        label="样片描述"
                        placeholder='请为大家介绍一下样片吧'
                        size='small'
                    />
                </Form.Item>

                <Item>
                    <Stack spacing={2}>
                        <Form.Item
                            name="covers"
                            multiple
                        >
                            <CoverComp />
                        </Form.Item>
                        <Form.Item
                            name="details"
                            multiple
                        >
                            <DetailComp />
                        </Form.Item>
                    </Stack>
                </Item>
            </Stack>

        </Item>
    )
})

export default SampleName;