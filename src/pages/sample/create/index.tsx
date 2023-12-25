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
import { SampleData, CostumeCount, ShootingTime, SampleTemplate } from 'declare/sample';
import { message } from 'components/globalMessage';
import { withTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { strToObj } from 'utils/funcTools';
import { Form } from 'components/FormValidator';

const Content = styled(Box)(({ theme }: any) => ({
    padding: theme.spacing(2),
}));

const defaultValue: Partial<SampleData> = {
    basicInfoVisible: true,
    costumeOffer: false,
    priceVisible: true,
    depositVisible: true,
    public: true
}

const handleRetriveData = (data: any): SampleData => {
    let rData = {
        ...data,
        covers: JSON.parse(data.covers),
        details: JSON.parse(data.details),
        tagIds: data.tags.map(tag => tag.id),
        shootingTime: data.shootingTime in ShootingTime ? data.shootingTime : 0,
        customShootingTime: data.shootingTime in ShootingTime ? null : data.shootingTime,
    }
    if (rData.costumeOffer) {
        rData["costumeCount"] = data.costumeCount in CostumeCount ? data.costumeCount : 0;
        rData["customCostumeCount"] = data.costumeCount in CostumeCount ? null : data.costumeCount;
    }
    return rData
}

const handleUpdateData = (data: SampleData): any => {
    const rData = {
        ...data,
        covers: JSON.stringify(data.covers),
        details: JSON.stringify(data.details),
    }
    if (rData.costumeOffer && `${rData.costumeCount}` === '0') rData.costumeCount = rData.customCostumeCount;
    if (`${rData.shootingTime}` === '0') rData.shootingTime = rData.customShootingTime;
    return rData
};


const SampleCreate = ({ t }: { t: any }) => {
    const [fieldValues, setFieldValues] = React.useState<Partial<SampleData>>(defaultValue);
    const location = useLocation();
    const searchParams = strToObj(location.search);
    const user = useGlobalStore(state => state.user);
    const activeTab = useSampleCreateStore(state => state.activeTab);
    const updateActiveTab = useSampleCreateStore(state => state.updateActiveTab);
    const { data: labels } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const retriveDraftMutation = useMutation({
        mutationFn: retriveDraft,
        onSuccess: (data) => {
            if (data) {
                Form.setValues(handleRetriveData(data));
            }
            else {
                Form.clear(defaultValue);
                setFieldValues(defaultValue);
            }
        }
    });
    const retriveSampleMutation = useMutation({
        mutationFn: retriveSample,
        onSuccess: (data) => Form.setValues(handleRetriveData(data))
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


    const saveSampleMutation = useMutation({
        mutationFn: saveSample,
        onSuccess: (data) => message.success('提交成功', { closeCallback: fetchInitialData }),
        onError: (error) => message.error(error.message)
    })

    const updateSampleMutation = useMutation({
        mutationFn: updateSampleFn,
        onSuccess: (data) =>  message.success('提交成功', { closeCallback: fetchInitialData }),
        onError: (error) => message.error(error.message),
    });
    const submit = (sample: SampleData, isDraft: boolean) => {
        if (fieldValues.id) {
            updateSampleMutation.mutate({ ...handleUpdateData(sample), userId: user.id, isDraft, id: fieldValues.id });
        } else {
            saveSampleMutation.mutate({ ...handleUpdateData(sample), userId: user.id, isDraft });
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
                    <Form
                        initialValues={fieldValues}
                        onValuesChange={(prev, cur) => setFieldValues(cur)}
                    >
                        <SampleName labels={labels} />
                        <SamplePrice fields={fieldValues} />
                        <SampleService fields={fieldValues} />
                        <SampleExtra />
                    </Form>

                    <Box className={styles.btns}>
                        {
                            !searchParams?.sampleId && (
                                <>
                                    <Button
                                        variant='outlined'
                                        className={styles.btn}
                                        onClick={fetchInitialData}
                                    >重置
                                    </Button>
                                    <Button
                                        variant='contained'
                                        className={styles.btn}
                                        onClick={() => Form.validates((errors, values) => !errors && submit(values, true))}
                                    >{fieldValues?.id ? '修改草稿' : '保存为草稿'}
                                    </Button>
                                </>
                            )
                        }
                        <Button
                            variant='contained'
                            color='success'
                            className={styles.btn}
                            onClick={() => Form.validates((errors, values) => !errors && submit(values, false))}
                        >{searchParams?.sampleId ? '更新样片' : '提交样片'}</Button>
                    </Box>
                </Stack>
            </Content>
        </Box>
    )
}

export default withTranslation()(React.memo((SampleCreate)));