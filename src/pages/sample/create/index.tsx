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
    updateSample as updateSampleFn,
    retriveSample
} from 'apis/sample';
import useGlobalStore from 'globalStore';
import { SampleData } from 'declare/sample';
import { message } from 'components/globalMessage';
import { withTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { strToObj } from 'utils/funcTools';

const Content = styled(Box)(({ theme }: any) => ({
    padding: theme.spacing(2),
}));


const SampleCreate = ({ t }: { t: any }) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const searchParams = strToObj(location.search);
    const user = useGlobalStore(state => state.user);
    const navigate = useNavigate()
    const activeTab = useSampleCreateStore(state => state.activeTab);
    const updateActiveTab = useSampleCreateStore(state => state.updateActiveTab);
    const sample = useSampleCreateStore(state => state.sample);
    const curTemp = useSampleCreateStore(state => state.templateState.curTemp);
    const updateSample = useSampleCreateStore(state => state.updateSample);
    const { data: labels } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const retriveDraftMutation = useMutation({
        mutationFn: retriveDraft,
        onSuccess: (data) => {
            if (data) updateSample({ ...data, covers: JSON.parse(data.covers), details: JSON.parse(data.details) });
            else updateSample({ ...initialSample, id: null });
        }
    });
    const retriveSampleMutation = useMutation({
        mutationFn: retriveSample,
        onSuccess: (data) => {
            updateSample({ ...data, covers: JSON.parse(data.covers), details: JSON.parse(data.details) })
        }
    })
    const fetchInitialData = React.useCallback(() => {
        if (searchParams?.sampleId) {
            retriveSampleMutation.mutate({ sampleId: Number(searchParams.sampleId) })
        } else {
            retriveDraftMutation.mutate()
        }
    }, [])
    React.useEffect(() => {
        fetchInitialData()
    }, []);
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
                closeCallback: fetchInitialData
            })
        },
        onError: (error) => message.error(error.message)
    })

    const updateSampleMutation = useMutation({
        mutationFn: updateSampleFn,
        onSuccess: (data) => {
            message.success('提交成功', {
                closeCallback: fetchInitialData
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
            {/* {t('aaa')} */}
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
                        {
                            !searchParams?.sampleId && (
                                <>
                                    <Button
                                        variant='outlined'
                                        className={styles.btn}
                                        onClick={fetchInitialData}
                                    >重置</Button>
                                    <Button
                                        variant='contained'
                                        className={styles.btn}
                                        onClick={() => submit(sample, true)}>{sample?.id ? '修改草稿' : '保存为草稿'}
                                    </Button>
                                </>
                            )
                        }

                        <Button
                            variant='contained'
                            color='success'
                            className={styles.btn}
                            onClick={() => submit(sample, false)}>{searchParams?.sampleId ? '更新样片' : '提交样片'}</Button>
                    </Box>
                </Stack>
            </Content>
        </Box>
    )
}

export default withTranslation()(React.memo((SampleCreate)));