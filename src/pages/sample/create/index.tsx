import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './index.module.scss';
import { useSampleCreateStore } from './store';
import SampleName from './sampleName';
import SamplePrice from './samplePrice';
import SampleService from './sampleService';
import SampleExtra from './sampleExtra';
import Stack from '@mui/material/Stack';
import styled from '@mui/material/styles/styled';

const Content = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
}));


const SampleCreate = () => {
    const activeTab = useSampleCreateStore(state => state.activeTab);
    const updateActiveTab = useSampleCreateStore(state => state.updateActiveTab);
    const sampleName = useSampleCreateStore(state => state.sampleName);
    const updateSampleName = useSampleCreateStore(state => state.updateSampleName);
    const samplePrice = useSampleCreateStore(state => state.samplePrice);
    const updateSamplePrice = useSampleCreateStore(state => state.updateSamplePrice);
    const sampleService = useSampleCreateStore(state => state.sampleService);
    const updateSampleService = useSampleCreateStore(state => state.updateSampleService);
    const sampleExtra = useSampleCreateStore(state => state.sampleExtra);
    const updateSampleExtra = useSampleCreateStore(state => state.updateSampleExtra);
    return (
        <Box className={styles.create}>
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
                        data={sampleName}
                        updateData={updateSampleName}
                    />
                    <SamplePrice
                        data={samplePrice}
                        updateData={updateSamplePrice}
                    />
                    <SampleService
                        data={sampleService}
                        updateData={updateSampleService}
                    />
                    <SampleExtra
                        data={sampleExtra}
                        updateData={updateSampleExtra}
                    />
                </Stack>
            </Content>

        </Box>
    )
}

export default React.memo(SampleCreate);