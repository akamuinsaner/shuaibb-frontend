import Stack from '@mui/material/Stack';
import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility'
import FormHelperText from '@mui/material/FormHelperText';
import { SampleData } from 'declare/sample';
import { Form } from 'components/FormValidator';
import { STANDARD_NUMBER } from 'common/rexps';

const SamplePrice = React.forwardRef(({
    fields
}: { fields: Partial<SampleData> }, ref: any) => {
    return (
        <Item ref={ref}>
            <Stack spacing={2}>
                <Typography>样片价格</Typography>
                <Form.Item
                    name="price"
                    rules={[
                        { required: true, msg: '请输入价格' },
                        { regex: STANDARD_NUMBER, msg: '请输入标准格式的数字' }
                    ]}
                >
                    {({ value, onChange, helperText }) => (<FormControl sx={{ m: 1 }}>
                        <InputLabel htmlFor="my-input">价格</InputLabel>
                        <OutlinedInput
                            label="价格"
                            placeholder='请输入套系价格'
                            type={fields.priceVisible ? 'text' : 'password'}
                            value={value}
                            onChange={onChange}
                            endAdornment={
                                <Form.Item
                                    name="priceVisible"
                                >
                                    {({ value, onChange }) => (<InputAdornment position="end">
                                        <IconButton onClick={() => onChange(!value as any)}>
                                            {value ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>)}
                                </Form.Item>
                            }
                        />
                        <FormHelperText>
                            {helperText || '常规价格值范围在1.00-500000.00元之间，请规范标价行为'}
                        </FormHelperText>
                    </FormControl>)}
                </Form.Item>
                <Form.Item
                    name="deposit"
                    rules={[
                        { required: true, msg: '请输入价格' },
                        { regex: STANDARD_NUMBER, msg: '请输入标准格式的数字' }
                    ]}
                >
                    {({ value, onChange, helperText }) => (<FormControl sx={{ m: 1 }}>
                        <InputLabel htmlFor="my-input">定金</InputLabel>
                        <OutlinedInput
                            label="定金"
                            placeholder='请输入套系定金价格'
                            type={fields.depositVisible ? 'text' : 'password'}
                            value={value}
                            onChange={onChange}
                            endAdornment={
                                <Form.Item
                                    name="depositVisible"
                                >
                                    {({ value, onChange }) => (<InputAdornment position="end">
                                        <IconButton onClick={() => onChange(!value as any)}>
                                            {value ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>)}
                                </Form.Item>
                            }
                        />
                        <FormHelperText>{helperText}</FormHelperText>
                    </FormControl>)}
                </Form.Item>

            </Stack>
        </Item>
    )
})

export default SamplePrice;