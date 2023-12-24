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

const SampleName = ({
    labels = []
}: {
    labels: SampleLabel[]
}) => {
    return (
        <Item elevation={3}>
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
                    multiple
                    rules={[
                        { max: 5, msg: '最多选择5个标签' }
                    ]}
                >
                    <TextField
                        fullWidth
                        label="样片标签"
                        placeholder='请选择样片标签'
                        size='small'
                        select
                        SelectProps={{ multiple: true }}
                    >
                        {labels.map((label) => (<MenuItem key={label.id} value={label.id}>{label.name}</MenuItem>))}
                    </TextField>
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
}

export default React.memo(SampleName);