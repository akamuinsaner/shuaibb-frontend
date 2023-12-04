import React from 'react';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import { useSampleCenterStore, initialState } from './store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sampleLabels, listSample, batchDeleteSample } from 'apis/sample';
import type { SampleData } from 'declare/sample';
import ListTable from 'components/ListTable';
import FilterFields from './filterFields';
import { headCells } from './config';
import Button from '@mui/material/Button'
import { confirm } from 'components/confirmDialog';
import { useNavigate } from 'react-router-dom'

const SampleCenter = () => {
    const {
        name,
        tagIds,
        startDate,
        endDate,
        dataList,
        pageInfo,
        orderParams,
        selectedKeys,
        updateState
    } = useSampleCenterStore(state => state)
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: labels = [] } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const sampleListMutation = useMutation({
        mutationFn: listSample,
        mutationKey: ['listSample'],
        onSuccess: (data) => {
            updateState({
                dataList: data.data,
                pageInfo: {
                    ...data
                }
            })
        }
    });
    const batchDeleteMutation = useMutation({
        mutationFn: batchDeleteSample,
        mutationKey: ['batchDelete'],
        onSuccess: (data) => {
            updateState({
                selectedKeys: [],
                pageInfo: initialState.pageInfo,

            });
            sampleListMutation.mutate({
                name: name.value,
                tagIds: tagIds.value,
                startDate: startDate.value,
                endDate: endDate.value,
                ...initialState.pageInfo,
                ...initialState.orderParams
            })
        }
    })
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
                    endDate: initialState.endDate,
                    selectedKeys: [],
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
                    orderParams: initialState.orderParams,
                    selectedKeys: [],
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
        <Box sx={{ margin: '16px 0', textAlign: 'right' }}>
            <Button
                variant='contained'
                color='error'
                sx={{ marginLeft: '16px' }}
                disabled={!selectedKeys.length}
                onClick={() => {
                    confirm.confirm({
                        title: '删除样片',
                        content: '删除后不可恢复，确认删除？',
                        confirmCallback: () => batchDeleteMutation.mutate({ ids: selectedKeys })
                    })
                }}
            >批量删除
            </Button>
            <Button
                variant='contained'
                sx={{ marginLeft: '16px' }}
                disabled={selectedKeys.length !== 1}
                onClick={() => {
                    navigate(`/sample/create?sampleId=${selectedKeys[0]}`)
                }}
            >编辑
            </Button>
        </Box>
        <ListTable<SampleData>
            orderParams={orderParams}
            headers={headCells}
            data={dataList}
            pageInfo={pageInfo}
            checkable={true}
            selectedKeys={selectedKeys}
            rowKey={'id'}
            onSelectRows={(selectedKeys) => updateState({ selectedKeys })}
            onChange={(params: any) => {
                updateState({
                    selectedKeys: [],
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