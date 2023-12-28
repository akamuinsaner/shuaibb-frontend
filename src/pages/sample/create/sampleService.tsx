import Stack from '@mui/material/Stack';
import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { SampleData, SampleTemplate } from 'declare/sample';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Template from './components/template';
import { useSampleCreateStore } from './store';
import { Form } from 'components/FormValidator';
import { STANDARD_INTEGER, STANDARD_NUMBER } from 'common/rexps';
import { formInstance } from 'components/FormValidator/form';
import { useTranslation } from 'react-i18next';

export const templateValidateFields = [
    'basicInfoVisible',
    'costumeOffer',
    'costumeCount',
    'customCostumeCount',
    'negativeFilmCount',
    'negaFilmAllOffer',
    'shootingTime',
    'customShootingTime',
    'refineCount',
    'shootingIndoor',
    'shootingSceneIndoorCount',
]


const SampleService = React.forwardRef(({
    fields,
    form
}: {
    fields: Partial<SampleData>;
    form: formInstance
}, ref: any) => {
    const { t } = useTranslation();
    const templateState = useSampleCreateStore(state => state.templateState);
    const tempData = templateState.curTemp
    console.log(tempData)
    React.useEffect(() => {
        if (!tempData) return;
        const { id, name, user, userId, ...updateData } = tempData;
        form.setValues(updateData);
    }, [tempData])
    return (
        <Item ref={ref}>
            <Stack spacing={2}>
                <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    {t('sample service')}
                    <Template form={form} />
                </Typography>
                <Form.Item
                    name="basicInfoVisible"
                >
                    {({ value, onChange }) => (<FormControl >
                        <FormLabel>{t('basic services')}</FormLabel>
                        <RadioGroup
                            row
                            value={value ? '1' : '0'}
                            onChange={(e) => onChange(!!Number(e.target.value))}
                        >
                            <FormControlLabel value={`1`} control={<Radio />} label={t('show basic services')} />
                            <FormControlLabel value={`0`} control={<Radio />} label={t('hide basic services')} />
                        </RadioGroup>
                    </FormControl>)}
                </Form.Item>
                <Item sx={{
                    overflow: 'hidden',
                    height: fields.basicInfoVisible ? 'auto' : 0,
                    padding: fields.basicInfoVisible ? '20px' : 0
                }}>
                    <Grid
                        spacing={2}
                        container
                    >
                        <Grid xs={4} item>
                            <Form.Item
                                name="costumeOffer"
                                rules={[{ required: true, msg: `${t('please select')}${t('costume')}` }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label={t('costume')}
                                    select
                                    value={typeof value === 'boolean' ? (value ? 1 : 0) : ''}
                                    onChange={(e) => onChange(!!Number(e.target.value))}
                                >
                                    <MenuItem value={0}>{t('not provide')}</MenuItem>
                                    <MenuItem value={1}>{t('provide')}</MenuItem>
                                </TextField>)}

                            </Form.Item>

                        </Grid>
                        <Grid xs={4} item>
                            {fields.costumeOffer ? <Form.Item
                                name="costumeCount"
                                rules={[{ required: true, msg: `${t('please select')}${t('costume count')}` }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label={t('costume count')}
                                    select
                                    value={value}
                                    onChange={(e) => onChange(Number(e.target.value))}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={0}>{t('custom')}</MenuItem>
                                </TextField>)}
                            </Form.Item> : null}
                        </Grid>
                        <Grid xs={4} item>
                            {(`${fields.costumeCount}` === '0' && fields.costumeOffer) ? <Form.Item
                                name="customCostumeCount"
                                rules={[
                                    { required: true, msg: `${t('please input')}${t('custom costume count')}` },
                                    { regex: STANDARD_INTEGER, msg: `${t('please input')}${t('standard number')}` }
                                ]}
                            >
                                <TextField
                                    label={t('custom costume count')}
                                    placeholder={`${t('please input')}${t('custom costume count')}`}
                                />
                            </Form.Item> : null}
                        </Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="negativeFilmCount"
                                rules={[
                                    { required: true, msg: `${t('please input')}${t('negative film count')}` },
                                    { regex: STANDARD_INTEGER, msg: `${t('please input')}${t('standard number')}` }
                                ]}
                            >
                                <TextField label={t('negative film count')} />
                            </Form.Item>
                        </Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="negaFilmAllOffer"
                                rules={[{ required: true, msg: `${t('please select')}${t('negative film all sent')}` }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label={t('negative film all sent')}
                                    select
                                    value={typeof value === 'boolean' ? (value ? 1 : 0) : ''}
                                    onChange={(e) => onChange(!!Number(e.target.value))}
                                >
                                    <MenuItem value={0}>{t('no')}</MenuItem>
                                    <MenuItem value={1}>{t('yes')}</MenuItem>
                                </TextField>)}
                            </Form.Item>

                        </Grid>
                        <Grid xs={4} item></Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="shootingTime"
                                rules={[{ required: true, msg: `${t('please select')}${t('shooting time')}` }]}
                            >
                                <TextField label={t('shooting time')} select>
                                    <MenuItem value={0.5}>{t('0.5h')}</MenuItem>
                                    <MenuItem value={1}>{t('1h')}</MenuItem>
                                    <MenuItem value={2}>{t('2h')}</MenuItem>
                                    <MenuItem value={4}>{t('4h')}</MenuItem>
                                    <MenuItem value={8}>{t('8h')}</MenuItem>
                                    <MenuItem value={0}>{t('custom')}</MenuItem>
                                </TextField>
                            </Form.Item>
                        </Grid>
                        <Grid xs={4} item>
                            {`${fields.shootingTime}` === '0' ? <Form.Item
                                name="customShootingTime"
                                rules={[
                                    { required: true, msg: `${t('please input')}${t('shooting time')}` },
                                    { regex: STANDARD_NUMBER, msg: `${t('please input')}${t('standard number')}` }
                                ]}
                            >
                                <TextField label={`${t('custom')} ${t('shooting time')}`} />
                            </Form.Item> : null}
                        </Grid>
                        <Grid xs={4} item></Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="refineCount"
                                rules={[
                                    { required: true, msg: `${t('please input')}${t('refine count')}` },
                                    { regex: STANDARD_INTEGER, msg: `${t('please input')}${t('standard number')}` }
                                ]}
                            >
                                <TextField label={t('refine count')} />
                            </Form.Item>

                        </Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="shootingIndoor"
                                rules={[{ required: true, msg: `${t('please input')}${t('shooting scene')}` }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label={t('shooting scene')}
                                    select
                                    value={typeof value === 'boolean' ? (value ? 1 : 0) : ''}
                                    onChange={(e) => onChange(!!Number(e.target.value))}
                                >
                                    <MenuItem value={1}>{t('shooting indoor')}</MenuItem>
                                    <MenuItem value={0}>{t('shooting outdoor')}</MenuItem>
                                </TextField>)}

                            </Form.Item>
                        </Grid>
                        <Grid xs={4} item>
                            {fields.shootingIndoor ? <Form.Item
                                name="shootingSceneIndoorCount"
                                rules={[
                                    { required: true, msg: `${t('please input')}${t('indoor count')}` },
                                    { regex: STANDARD_INTEGER, msg: `${t('please input')}${t('standard number')}` }
                                ]}
                            >
                                <TextField label={t('indoor count')} />
                            </Form.Item> : null}
                        </Grid>
                    </Grid>
                </Item>
                <Form.Item
                    name="customDetail"
                >
                    <TextField
                        label={t('custom detail')}
                        rows={9}
                        multiline
                        placeholder={t('custom detail tip')}
                    />
                </Form.Item>

            </Stack>
        </Item>
    )
})

export default SampleService;