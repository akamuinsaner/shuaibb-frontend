import Stack from '@mui/material/Stack';
import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { SampleData } from 'declare/sample';
import { Form } from 'components/FormValidator';

const SampleExtra = React.forwardRef((props, ref: any) => {
    return (
        <Item ref={ref}>
            <Stack spacing={2}>
                <Typography>其他内容</Typography>
                <FormControlLabel
                    control={
                        <Form.Item name="public">
                            {({ value, onChange }) => (<Switch
                                color="primary"
                                checked={value as any}
                                onChange={(e) => onChange(e.target.checked)}
                            />)}
                        </Form.Item>}
                    label="对外公开"
                    labelPlacement="end"
                />
                <Form.Item name="tips">
                    <TextField label="温馨提示" rows={9} multiline
                        placeholder="【拍摄服务】&#10;可拍摄两次&#10;提供专业服装店内任选（可定制）并赠送服装一套&#10;【贴心服务】&#10;1：专业摄影师一对一服务&#10;2：全程摄影师，引导师全程跟拍&#10;3：免费享受首页影棚拍摄或者外景拍摄，可上门定制拍摄&#10;【尊贵享受】&#10;40张精修片，方10寸相册一本，入册24张底片（12p精修时尚设计）&#10;
                    "
                    />
                </Form.Item>

            </Stack>
        </Item>
    )
})

export default SampleExtra;