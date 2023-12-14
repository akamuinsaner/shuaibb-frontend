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

const Template = () => {
    const queryClient = useQueryClient();
    const templateState = useSampleCreateStore(state => state.templateState);
    const updateTemplateState = useSampleCreateStore(state => state.updateTemplateState);
    let { data: templates = [] } = useQuery({ queryFn: sampleTemplatesFn, queryKey: ['sampleTemplatesFn'] })
    templates = templates.map(data => {
        let rData = {
            ...data,
            shootingTime: data.shootingTime in ShootingTime ? data.shootingTime : 0,
            customShootingTime: data.shootingTime in ShootingTime ? null : data.shootingTime,
        }
        if (rData.costumeOffer) {
            rData["costumeCount"] = data.costumeCount in CostumeCount ? data.costumeCount : 0;
            rData["customCostumeCount"] = data.costumeCount in CostumeCount ? null : data.costumeCount;
        }
        return rData
    })
    const deleteTemplateMutation = useMutation({
        mutationFn: sampleTemplateDeleteFn,
        onSettled: (data) => {
            message.success('删除模板成功', {
                closeCallback: () => queryClient.invalidateQueries({ queryKey: ['sampleTemplatesFn'] })
            })
        }
    });
    const updateTemplateMutation = useMutation({
        mutationFn: sampleTemplateUpdateFn,
        onSuccess: (data) => {
            message.success('更新模板成功', {
                closeCallback: () => queryClient.invalidateQueries({ queryKey: ['sampleTemplatesFn'] })
            })
        }
    })
    React.useEffect(() => {
        if (!templates?.find((temp: SampleTemplate) => temp.id === templateState.curTemp?.id)) {
            updateTemplateState({ curTemp: null })
        }
    }, [templates?.length])
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
                                    title: `是否删除模板${templateState.curTemp?.name}`,
                                    content: '操作不可恢复，确认继续？',
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
                        message.warning('请先选择一个模板');
                        return;
                    }
                    updateTemplateMutation.mutate({
                        ...templateState.curTemp
                    })
                }}
            >更新模板</Button>
            <Button
                variant="contained"
                onClick={() => {
                    updateTemplateState({
                        dialogOpen: true,
                        dialogType: 'create'
                    })
                }}
            >存为新模板</Button>
            <TemplateNameDialog />
        </Stack>
    ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                sx={{ margin: '0 16px' }}
                variant='outlined'
                onClick={() => updateTemplateState({
                    dialogOpen: true,
                    dialogType: 'create'
                })}
            >存为新模板</Button>
            <Box>第一次查看新模板时，请<Button variant='text'>点此查看详情</Button>学习</Box>
            <TemplateNameDialog />
        </Box>
    )
}

export default React.memo(Template);