import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { STANDARD_NAME } from 'common/rexps';
import { useSampleCreateStore } from '../store';
import { sampleTemplateCreateFn, sampleTemplateUpdateFn } from 'apis/sample';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useGlobalStore from 'globalStore';
import { message } from 'components/globalMessage';
import { Form } from 'components/FormValidator';
import { useTranslation } from 'react-i18next';

const TemplateNameDialog = ({
    fields,
}: {
    fields: any;
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient();
    const templateState = useSampleCreateStore(state => state.templateState);
    const user = useGlobalStore(state => state.user);
    const updateTemplateState = useSampleCreateStore(state => state.updateTemplateState);
    const saveSampleTemplateMutation = useMutation({
        mutationFn: sampleTemplateCreateFn,
        onSuccess: (data) => {
            updateTemplateState({ nameText: '', dialogOpen: false });
            message.success(t('create success'), {
                closeCallback: () => queryClient.invalidateQueries({ queryKey: ['sampleTemplatesFn'] })
            });
        },
        onError: (error) => {
            message.error(error.message)
        }
    })
    const updateTemplateMutation = useMutation({
        mutationFn: sampleTemplateUpdateFn,
        onSuccess: (data) => {
            updateTemplateState({ nameText: '', dialogOpen: false });
            message.success(t('update success'), {
                closeCallback: () => { queryClient.invalidateQueries({ queryKey: ['sampleTemplatesFn'] }) }
            })
        }
    })
    const getData = React.useCallback((name: string) => {
        const rData = { ...fields, name, userId: user.id, id: templateState?.curTemp?.id }
        if (rData.costumeOffer && `${rData.costumeCount}` === '0') rData.costumeCount = rData.customCostumeCount;
        if (`${rData.shootingTime}` === '0') rData.shootingTime = rData.customShootingTime;
        return rData;
    }, [fields])
    return (

        <Dialog
            open={templateState.dialogOpen}
            maxWidth="sm"
            fullWidth
        >
            <Form
                initialValues={{ name: templateState.nameText }}
                submit={(values) => {
                    if (values) {
                        if (templateState.dialogType === 'create') saveSampleTemplateMutation.mutate(getData(values.name))
                        if (templateState.dialogType === 'update') updateTemplateMutation.mutate(getData(values.name))
                    }
                }}
            >
                <DialogTitle>
                    {templateState.dialogType === 'create'
                        ? t('create template')
                        : t('update template')}
                </DialogTitle>
                <DialogContent>

                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, msg: `${t('please input')}${t('template name')}` },
                            { regex: STANDARD_NAME, msg: `${t('please input')}${t('characters limited in 20')}` }
                        ]}
                    >
                        <TextField />
                    </Form.Item>


                </DialogContent>
                <DialogActions>
                    <Button
                        variant='outlined'
                        onClick={() => updateTemplateState({
                            nameText: '',
                            dialogOpen: false
                        })}
                    >{t('cancel')}</Button>
                    <Form.Submit>
                        <Button variant='contained'>{t('confirm')}</Button>
                    </Form.Submit>

                </DialogActions>
            </Form>
        </Dialog>
    )
}

export default React.memo(TemplateNameDialog);
