import Stack from '@mui/material/Stack';
import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { SampleData } from 'declare/sample';
import { Form } from 'components/FormValidator';
import { useTranslation } from 'react-i18next';

const SampleExtra = React.forwardRef((props, ref: any) => {
    const { t } = useTranslation();
    return (
        <Item ref={ref}>
            <Stack spacing={2}>
                <Typography>{t('sample others')}</Typography>
                <FormControlLabel
                    control={
                        <Form.Item name="public">
                            {({ value, onChange }) => (<Switch
                                color="primary"
                                checked={value as any}
                                onChange={(e) => onChange(e.target.checked)}
                            />)}
                        </Form.Item>}
                    label={t('public')}
                    labelPlacement="end"
                />
                <Form.Item name="tips">
                    <TextField label={t('tip')} rows={9} multiline
                        placeholder={t('custom detail tip')}
                    />
                </Form.Item>
            </Stack>
        </Item>
    )
})

export default SampleExtra;