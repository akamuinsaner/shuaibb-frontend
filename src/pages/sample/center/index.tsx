import React from 'react';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import { useSampleCenterStore, initialState } from './store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sampleLabels, listSample } from 'apis/sample';
import type { SampleData } from 'declare/sample';
import ListTable from 'components/ListTable';
import FilterFields from './filterFields';
import { headCells } from './config';

const SampleCenter = () => {
    const {
        name,
        tagIds,
        startDate,
        endDate,
        dataList,
        pageInfo,
        orderParams,
        updateState
    } = useSampleCenterStore(state => state)
    const queryClient = useQueryClient();
    const { data: labels = [] } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const sampleListMutation = useMutation({
        mutationFn: listSample,
        mutationKey: ['listSample'],
        onSuccess: (data) => {
            updateState({
                dataList: data.data,

            })
        }
    });
    React.useEffect(() => {
        sampleListMutation.mutate({
            ...pageInfo
        })
    }, []);

    return <Box className={styles.page}>
        <FilterFields
            labels={labels}
            onClear={() => {
                updateState({
                    pageInfo: initialState.pageInfo,
                    orderParams: initialState.orderParams,
                    name: initialState.name,
                    tagIds: initialState.tagIds,
                    startDate: initialState.startDate,
                    endDate: initialState.endDate
                })
                sampleListMutation.mutate({
                    name: initialState.name.value,
                    tagIds: initialState.tagIds.value,
                    startDate: initialState.startDate.value,
                    endDate: initialState.endDate.value,
                    ...initialState.pageInfo,
                    ...initialState.orderParams
                })
            }}
            onSearch={() => {
                updateState({
                    pageInfo: initialState.pageInfo,
                    orderParams: initialState.orderParams
                })
                sampleListMutation.mutate({
                    name: name.value,
                    tagIds: tagIds.value,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    ...initialState.pageInfo,
                    ...initialState.orderParams
                })
            }}
        />
        <ListTable<SampleData>
            orderParams={orderParams}
            headers={headCells}
            data={dataList}
            pageInfo={pageInfo}
            onChange={(params: any) => {
                updateState({
                    pageInfo: {
                        offset: params.offset,
                        limit: params.limit,
                        total: params.total
                    },
                    orderParams: {
                        order: params.order,
                        orderBy: params.orderBy,
                    }
                })
                sampleListMutation.mutate({
                    ...params,
                    name: name.value,
                    tagIds: tagIds.value,
                    startDate: startDate.value,
                    endDate: endDate.value
                })
            }}
        />
    </Box>
}

export default React.memo(SampleCenter);