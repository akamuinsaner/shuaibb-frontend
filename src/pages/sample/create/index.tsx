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
import { useTranslation } from 'react-i18next';

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
        shootingTime: data.shootingTime in ShootingTime ? data.shootingTime : '0',
        customShootingTime: data.shootingTime in ShootingTime ? null : data.shootingTime,
    }
    if (rData.costumeOffer) {
        rData["costumeCount"] = data.costumeCount in CostumeCount ? data.costumeCount : '0';
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


const SampleCreate = () => {
    const { t }  = useTranslation()
    const form = Form.useForm();
    const refs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];
    const [fieldValues, setFieldValues] = React.useState<Partial<SampleData>>(defaultValue);
    const location = useLocation();
    const searchParams = strToObj(location.search);
    const user = useGlobalStore(state => state.user);
    const activeTab = useSampleCreateStore(state => state.activeTab);
    const updateActiveTab = useSampleCreateStore(state => state.updateActiveTab);
    const { data: labels = [] } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const retriveDraftMutation = useMutation({
        mutationFn: retriveDraft,
        onSuccess: (data) => {
            if (data) {
                form.setValues(handleRetriveData(data));
            }
            else {
                form.clear(defaultValue);
                setFieldValues(defaultValue);
            }
        }
    });
    const retriveSampleMutation = useMutation({
        mutationFn: retriveSample,
        onSuccess: (data) => form.setValues(handleRetriveData(data))
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

    React.useEffect(() => refs[activeTab].current.scrollIntoView({
        behavior: 'smooth'
    }), [activeTab])

    React.useEffect(() => {

    }, [])

    const saveSampleMutation = useMutation({
        mutationFn: saveSample,
        onSuccess: (data) => message.success('提交成功', { closeCallback: fetchInitialData }),
    })

    const updateSampleMutation = useMutation({
        mutationFn: updateSampleFn,
        onSuccess: (data) => message.success('提交成功', { closeCallback: fetchInitialData }),
    });

    const formatSubmitData = React.useCallback((isDraft: boolean) => (values: any) => {
        return ({ ...handleUpdateData(values), userId: user.id, id: fieldValues?.id, isDraft });
    }, [fieldValues]);

    const submit = (data: any) => {
        if (data.id) {
            updateSampleMutation.mutate(data);
        } else {
            saveSampleMutation.mutate(data);
        }
    }

    return (
        <Box className={styles.create}>
            {/* {t('aaa')} */}
            <Box className={styles.tabsBox}>
                <Tabs value={activeTab} onChange={(e, value) => updateActiveTab(value)}>
                    <Tab label={t('sample name')} />
                    <Tab label={t('sample price')} />
                    <Tab label={t('sample service')} />
                    <Tab label={t('sample others')} />
                </Tabs>
            </Box>
            <Content>
                <Stack spacing={2}>
                    <Form
                        initialValues={fieldValues}
                        onValuesChange={(prev, cur) => setFieldValues(cur)}
                        submit={submit}
                        form={form}
                    >
                        <SampleName labels={labels} ref={refs[0]} />
                        <SamplePrice fields={fieldValues} ref={refs[1]} />
                        <SampleService fields={fieldValues} form={form} ref={refs[2]} />
                        <SampleExtra ref={refs[3]} />
                    </Form>
                </Stack>
            </Content>
            <Box className={styles.btns}>
                {
                    !searchParams?.sampleId && (
                        <>
                            <Button
                                variant='outlined'
                                className={styles.btn}
                                onClick={fetchInitialData}
                            >{t('reset')}
                            </Button>
                            <Form.Submit
                                data={formatSubmitData(true)}
                            >
                                <Button variant='contained' className={styles.btn}>
                                    {fieldValues?.id ? t('edit draft') : t('save draft')}
                                </Button>
                            </Form.Submit>
                        </>
                    )
                }
                <Form.Submit
                    data={formatSubmitData(false)}
                >
                    <Button variant='contained' color='success' className={styles.btn}
                    >{searchParams?.sampleId ? t('edit sample') : t('save sample')}</Button>
                </Form.Submit>

            </Box>
        </Box>
    )
}

export default React.memo(SampleCreate);