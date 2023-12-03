import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SAMPLE_TEMPLATE_NAME } from 'common/rexps';
import { useSampleCreateStore } from '../store';
import { SampleTemplate } from 'declare/sample';
import { sampleTemplateCreateFn, sampleTemplateUpdateFn } from 'apis/sample';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useGlobalStore from 'globalStore';
import { message } from 'components/globalMessage';


const TemplateNameDialog = () => {
    const sample = useSampleCreateStore(state => state.sample);
    const queryClient = useQueryClient();
    const templateState = useSampleCreateStore(state => state.templateState);
    const tempData = templateState?.curTemp || sample;
    const user = useGlobalStore(state => state.user);
    const updateTemplateState = useSampleCreateStore(state => state.updateTemplateState);
    const onNameInput = React.useCallback((e: any) => {
        const value = e.target.value;
        updateTemplateState({ nameText: value });
        if (SAMPLE_TEMPLATE_NAME.test(value)) {
            updateTemplateState({ errText: '' });
        } else if (!value) {
            updateTemplateState({ errText: '标题内容不能为空' })
        } else {
            updateTemplateState({ errText: '请输入正确格式的标题' })
        }
    }, [])
    const saveSampleTemplateMutation = useMutation({
        mutationFn: sampleTemplateCreateFn,
        onSuccess: (data) => {
            updateTemplateState({ nameText: '', dialogOpen: false });
            message.success('模板创建成功', {
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
            message.success('更新模板成功', {
                closeCallback: () => {queryClient.invalidateQueries({ queryKey: ['sampleTemplatesFn'] })}
            })
        }
    })
    const getData = React.useCallback(() => {
        return {
            ...tempData,
            name: templateState.nameText,
            userId: user.id
        }
    }, [templateState.nameText, tempData])
    return (
        <Dialog
            open={templateState.dialogOpen}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>{templateState.dialogType === 'create' ? '新建模板' : '编辑模板'}</DialogTitle>
            <DialogContent>
                <TextField
                    error={!!templateState.errText}
                    label=""
                    placeholder='请输入模板名称（数字字母组合且不超过20个字）'
                    value={templateState.nameText}
                    onChange={onNameInput}
                    fullWidth
                    size='small'
                    helperText={templateState.errText}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => updateTemplateState({
                    nameText: '',
                    dialogOpen: false
                })}>取消</Button>
                <Button variant='contained' onClick={() => {
                    if (templateState.dialogType === 'create') saveSampleTemplateMutation.mutate(getData())
                    if (templateState.dialogType === 'update') updateTemplateMutation.mutate(getData())
                }}>确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(TemplateNameDialog);
