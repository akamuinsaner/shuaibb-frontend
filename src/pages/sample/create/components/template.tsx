import React from 'react';
import type { SampleTemplate } from 'declare/sample';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TemplateNameDialog from './templateNameDialog';
import { useSampleCreateStore } from '../store';
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import {
    sampleTemplatesFn,
    sampleTemplateDeleteFn,
    sampleTemplateUpdateFn
} from 'apis/sample';
import { message } from 'components/globalMessage';
import { confirm } from 'components/confirmDialog';
import { SampleData, CostumeCount, ShootingTime } from 'declare/sample';
import { formInstance } from 'components/FormValidator/form';
import { templateValidateFields } from '../sampleService';
import { useTranslation } from 'react-i18next';

const Template = ({
    form
}: {
    form: formInstance
}) => {
    const { t }  = useTranslation()
    const [curTemplateValues, setCurTemplateValues] = React.useState<any>(null);
    const queryClient = useQueryClient();
    const templateState = useSampleCreateStore(state => state.templateState);
    const updateTemplateState = useSampleCreateStore(state => state.updateTemplateState);
    let { data: templates = [] } = useQuery({ queryFn: sampleTemplatesFn, queryKey: ['sampleTemplatesFn'] })
    templates = templates.map(data => {
        let rData = {
            ...data,
            shootingTime: data.shootingTime in ShootingTime ? data.shootingTime : '0',
            customShootingTime: data.shootingTime in ShootingTime ? null : data.shootingTime,
        }
        if (rData.costumeOffer) {
            rData["costumeCount"] = data.costumeCount in CostumeCount ? data.costumeCount : '0';
            rData["customCostumeCount"] = data.costumeCount in CostumeCount ? null : data.costumeCount;
        }
        return rData
    })
    const deleteTemplateMutation = useMutation({
        mutationFn: sampleTemplateDeleteFn,
        onSettled: (data) => {
            message.success(t('delete success'), {
                closeCallback: () => queryClient.invalidateQueries({ queryKey: ['sampleTemplatesFn'] })
            })
        }
    });
    const updateTemplateMutation = useMutation({
        mutationFn: sampleTemplateUpdateFn,
        onSuccess: (data) => {
            message.success(t('update success'), {
                closeCallback: () => queryClient.invalidateQueries({ queryKey: ['sampleTemplatesFn'] })
            })
        }
    })
    React.useEffect(() => {
        if (!templates?.find((temp: SampleTemplate) => temp.id === templateState.curTemp?.id)) {
            updateTemplateState({ curTemp: null })
        }
    }, [templates?.length])
    const getData = React.useCallback((values) => {
        if (values.costumeOffer && `${values.costumeCount}` === '0') values.costumeCount = values.customCostumeCount;
        if (`${values.shootingTime}` === '0') values.shootingTime = values.customShootingTime;
        return values;
    }, [])
    return templates?.length ? (
        <Stack sx={{ paddingLeft: '20px' }} spacing={2} direction="row">
            <TextField
                select
                size='small'
                sx={{ width: '240px' }}
                SelectProps={{
                    renderValue: (value) => {
                        return templateState?.curTemp?.name
                    }
                }}
                value={templateState.curTemp?.id || ''}
                onChange={(e) => {
                    const temp = (templates || []).find((item: SampleTemplate) => `${item.id}` === `${e.target.value}`)
                    if (temp) updateTemplateState({ curTemp: temp })
                }}
            >
                {templates.map((temp: SampleTemplate) => (
                    <MenuItem
                        key={temp.id}
                        value={temp.id}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Typography
                            sx={{ flex: 1 }}
                        >{temp.name}</Typography>
                        <IconButton
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateTemplateState({
                                    dialogOpen: true,
                                    dialogType: 'update',
                                    nameText: temp.name
                                })
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                confirm.confirm({
                                    title: t('delete'),
                                    content: t('operation cannot be revoked'),
                                    confirmCallback: () => {
                                        deleteTemplateMutation.mutate({ id: temp.id });
                                    }
                                })
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </MenuItem>
                ))}
            </TextField>
            <Button
                variant="contained"
                onClick={() => {
                    if (!templateState?.curTemp) {
                        message.warning(t('please select one first'));
                        return;
                    }
                    const { id, name, user, userId, ...fields } = templateState.curTemp;
                    form.validates((errors, values) => {
                        if (!errors) {
                            updateTemplateMutation.mutate({
                                ...getData(values),
                                name: templateState.curTemp['name'],
                                id: templateState.curTemp['id'],
                                user: templateState.curTemp['user'],
                                userId: templateState.curTemp['userId'],
                            })
                        }
                    }, templateValidateFields)

                }}
            >{t('update template')}</Button>
            <Button
                variant="contained"
                onClick={() => {
                    form.validates((errors, values) => {
                        if (!errors) {
                            setCurTemplateValues(values);
                            updateTemplateState({
                                dialogOpen: true,
                                dialogType: 'create'
                            })
                        }
                    }, templateValidateFields)

                }}
            >{t('save new template')}</Button>
            <TemplateNameDialog fields={curTemplateValues} />
        </Stack>
    ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                sx={{ margin: '0 16px' }}
                variant='outlined'
                onClick={() => {
                    form.validates((errors, values) => {
                        if (!errors) {
                            setCurTemplateValues(values);
                            updateTemplateState({
                                dialogOpen: true,
                                dialogType: 'create'
                            })
                        }
                    }, templateValidateFields)

                }}
            >{t('save new template')}</Button>
            <Box>{t('first here')}，{t('please')}<Button variant='text'>{t('click here')}</Button>{t('learn more')}</Box>
            <TemplateNameDialog fields={curTemplateValues} />
        </Box>
    )
}

export default React.memo(Template);