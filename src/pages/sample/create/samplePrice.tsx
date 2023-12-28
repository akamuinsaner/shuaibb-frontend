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
import { useTranslation } from 'react-i18next';

const SamplePrice = React.forwardRef(({
    fields
}: { fields: Partial<SampleData> }, ref: any) => {
    const { t } = useTranslation();
    return (
        <Item ref={ref}>
            <Stack spacing={2}>
                <Typography>{t('sample price')}</Typography>
                <Form.Item
                    name="price"
                    rules={[
                        { required: true, msg: `${t('please input')}${t('price')}` },
                        { regex: STANDARD_NUMBER, msg: `${t('please input')}${t('standard number')}` }
                    ]}
                >
                    {({ value, onChange, helperText }) => (<FormControl sx={{ m: 1 }}>
                        <InputLabel htmlFor="my-input">{t('price')}</InputLabel>
                        <OutlinedInput
                            label={t('price')}
                            placeholder={`${t('please input')}${t('price')}`}
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
                            {helperText || t('sample price tip')}
                        </FormHelperText>
                    </FormControl>)}
                </Form.Item>
                <Form.Item
                    name="deposit"
                    rules={[
                        { required: true, msg: `${t('please input')}${t('deposit')}` },
                        { regex: STANDARD_NUMBER, msg: `${t('please input')}${t('standard number')}` }
                    ]}
                >
                    {({ value, onChange, helperText }) => (<FormControl sx={{ m: 1 }}>
                        <InputLabel htmlFor="my-input">{t('deposit')}</InputLabel>
                        <OutlinedInput
                            label={t('deposit')}
                            placeholder={`${t('please input')}${t('deposit')}`}
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