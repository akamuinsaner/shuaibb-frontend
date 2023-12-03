import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './index.module.scss';
import { useSampleCreateStore, initialSample } from './store';
import SampleName from './sampleName';
import SamplePrice from './samplePrice';
import SampleService from './sampleService';
import SampleExtra from './sampleExtra';
import Stack from '@mui/material/Stack';
import styled from '@mui/material/styles/styled';
import Button from '@mui/material/Button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    saveSample,
    retriveDraft,
    sampleLabels,
    updateSample as updateSampleFn
} from 'apis/sample';
import useGlobalStore from 'globalStore';
import { SampleData, SampleLabel } from 'declare/sample';
import { message } from 'components/globalMessage';
import { useTranslation, Trans, withTranslation } from 'react-i18next';

const Content = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
}));


const SampleCreate = ({ t }: { t: any }) => {
    const queryClient = useQueryClient();
    const user = useGlobalStore(state => state.user);
    const activeTab = useSampleCreateStore(state => state.activeTab);
    const updateActiveTab = useSampleCreateStore(state => state.updateActiveTab);
    const sample = useSampleCreateStore(state => state.sample);
    const curTemp = useSampleCreateStore(state => state.templateState.curTemp);
    const updateSample = useSampleCreateStore(state => state.updateSample);
    const { data: labels } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const { data: draft, isFetching } = useQuery({ queryFn: retriveDraft, queryKey: ['retriveDraft'] });
    React.useEffect(() => {
        if (!isFetching && draft) updateSample({ ...draft, covers: JSON.parse(draft.covers), details: JSON.parse(draft.details) });
        if (!isFetching && !draft) updateSample({ ...initialSample, id: null });
    }, [draft, isFetching]);
    const handleSampleData = React.useCallback((data: SampleData): any => {
        let temp = Object.assign({}, curTemp, {});
        delete temp.id;
        return {
            ...data,
            covers: JSON.stringify(data.covers),
            details: JSON.stringify(data.details),
            ...temp
        }
    }, [curTemp]);
    const saveSampleMutation = useMutation({
        mutationFn: saveSample,
        onSuccess: (data) => {
            message.success('提交成功', {
                closeCallback: () => queryClient.invalidateQueries({ queryKey: ['retriveDraft'] })
            })
        },
        onError: (error) => message.error(error.message)
    })

    const updateSampleMutation = useMutation({
        mutationFn: updateSampleFn,
        onSuccess: (data) => {
            message.success('提交成功', {
                closeCallback: () => queryClient.invalidateQueries({ queryKey: ['retriveDraft'] })
            })
        },
        onError: (error) => message.error(error.message)
    });
    const submit = (sample: SampleData, isDraft: boolean) => {
        if (sample.id) {
            updateSampleMutation.mutate({ ...handleSampleData(sample), userId: user.id, isDraft });
        } else {
            saveSampleMutation.mutate({ ...handleSampleData(sample), userId: user.id, isDraft });
        }
    }

    return (
        <Box className={styles.create}>
            {t('aaa')}
            <Box className={styles.tabsBox}>
                <Tabs value={activeTab} onChange={(e, value) => updateActiveTab(value)}>
                    <Tab label="样片名称" />
                    <Tab label="样片价格" />
                    <Tab label="服务内容" />
                    <Tab label="其他内容" />
                </Tabs>
            </Box>
            <Content>
                <Stack spacing={2}>
                    <SampleName
                        data={sample}
                        updateData={updateSample}
                        labels={labels}
                    />
                    <SamplePrice
                        data={sample}
                        updateData={updateSample}
                    />
                    <SampleService
                        data={sample}
                        updateData={updateSample}
                    />
                    <SampleExtra
                        data={sample}
                        updateData={updateSample}
                    />
                    <Box className={styles.btns}>
                        <Button
                            variant='outlined'
                            className={styles.btn}
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['retriveDraft'] })}
                        >重置</Button>
                        <Button
                            variant='contained'
                            className={styles.btn}
                            onClick={() => submit(sample, true)}>{sample?.id ? '修改草稿' : '保存为草稿'}</Button>
                        <Button
                            variant='contained'
                            color='success'
                            className={styles.btn}
                            onClick={() => submit(sample, false)}>提交样片</Button>
                    </Box>
                </Stack>
            </Content>
        </Box>
    )
}

export default withTranslation()(React.memo((SampleCreate)));