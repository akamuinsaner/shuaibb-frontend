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
import { useTranslation } from 'react-i18next';

const SampleName = React.forwardRef(({
    labels = []
}: {
    labels: SampleLabel[]
}, ref: any) => {
    const { t }  = useTranslation()
    return (
        <Item elevation={3} ref={ref}>
            <Stack spacing={2}>
                <Typography>{t('sample name')}</Typography>
                <Form.Item
                    name="name"
                    rules={[
                        { required: true, msg: `${t('please input')}${t('sample name')}`},
                        { regex: NAME_REXP, msg: `${t('please input')}${t('characters limited in 20')}`}
                    ]}
                >
                    <TextField
                        required
                        fullWidth
                        label={t('sample name')}
                        placeholder={`${t('please input')}${t('sample name')}`}
                        size='small'
                    />
                </Form.Item>
                <Form.Item
                    name="tagIds"
                >
                    <CascadeSelect
                        label={t('sample labels')}
                        placeholder={`${t('please select')}${t('sample labels')}`}
                        multiple
                        options={labels.filter(l => !l.parentId)}
                    />
                </Form.Item>
                <Form.Item
                    name="desc"
                >
                    <TextField
                        fullWidth
                        label={t('sample description')}
                        placeholder={t('introduce to others')}
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