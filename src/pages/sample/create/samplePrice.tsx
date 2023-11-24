import Stack from '@mui/material/Stack';
import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility'
import FormHelperText from '@mui/material/FormHelperText';
import { SamplePriceState } from './store';

const SamplePrice = ({
    data,
    updateData
}: {
    data: SamplePriceState;
    updateData: (data: Partial<SamplePriceState>)  => void
}) => {
    return (
        <Item>
            <Stack spacing={2}>
                <Typography>样片价格</Typography>
                <FormControl sx={{ m: 1 }}>
                    <InputLabel htmlFor="my-input" size="small">价格</InputLabel>
                    <OutlinedInput
                        required
                        size="small"
                        fullWidth
                        label="价格"
                        placeholder='请输入套系价格'
                        type={data.priceVisible ? 'number' : 'password'}
                        value={data.price}
                        onChange={(e) => updateData({ price: Number(e.target.value) })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => updateData({ priceVisible: !data.priceVisible})}
                                    edge="end"
                                >
                                    {data.priceVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>常规价格值范围在1.00-500000.00元之间，请规范标价行为</FormHelperText>
                </FormControl>
                <FormControl sx={{ m: 1 }}>
                    <InputLabel htmlFor="my-input" size="small">定金</InputLabel>
                    <OutlinedInput
                        required
                        fullWidth
                        size="small"
                        label="定金"
                        placeholder='请输入套系定金价格'
                        type={data.depositVisible ? 'number' : 'password'}
                        value={data.deposit}
                        onChange={(e) => updateData({ deposit: Number(e.target.value) })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => updateData({ depositVisible: !data.depositVisible })}
                                    edge="end"
                                >
                                    {data.depositVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Stack>
        </Item>
    )
}

export default React.memo(SamplePrice);