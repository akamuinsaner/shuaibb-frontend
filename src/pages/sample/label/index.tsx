import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FilterFields from 'components/FilterFields';
import { useStore } from './store';
import ListTable from 'components/ListTable';
import {
    sampleLabels,
    searchSampleLabel,
    deleteSampleLabel,
    createSampleLabels,
    updateSampleLabel
} from 'apis/sample';
import { useMutation } from '@tanstack/react-query';
import Link from '@mui/material/Link';
import { confirm } from 'components/confirmDialog';
import { SampleLabel } from 'declare/sample';
import CreateLabelDialog from './createLabelDialog';
import { message } from 'components/globalMessage';

const Label = () => {
    const {
        pageInfo,
        labels,
        filterParams,
        selectKeys,
        createDialogOpen,
        curEditRecord,
        allLabels,
        updateState
    } = useStore(state => state);
    const fullSampleLabelsMutation = useMutation({
        mutationFn: sampleLabels,
        onSuccess: (data) => updateState({ allLabels: data }),
    })
    const listSampleLabelsMutation = useMutation({
        mutationFn: searchSampleLabel,
        onSuccess: ({ data, total, offset }) => {
            updateState({
                pageInfo: { ...pageInfo, offset: 0, total },
                labels: data
            })
        }
    })

    const createSampleLabelMutation = useMutation({
        mutationFn: createSampleLabels,
        onSuccess: (data) => message.success('新建标签成功', {
            closeCallback: () => {
                listSampleLabelsMutation.mutate({ ...filterParams, ...pageInfo, offset: 0 });
                fullSampleLabelsMutation.mutate();
            }
        }) 
    });


    const updateSampleLabelMutation = useMutation({
        mutationFn: updateSampleLabel,
        onSuccess: (data) => message.success('更新标签成功', {
            closeCallback: () => {
                listSampleLabelsMutation.mutate({ ...filterParams, ...pageInfo, offset: 0 });
                fullSampleLabelsMutation.mutate();
            }
        }) 
    })

    const deleteSampleLabelMutation = useMutation({
        mutationFn: deleteSampleLabel,
        onSettled: () => {
            listSampleLabelsMutation.mutate({ ...filterParams, ...pageInfo, offset: 0 });
            fullSampleLabelsMutation.mutate();
        }
    })

    React.useEffect(() => {
        listSampleLabelsMutation.mutate({ ...filterParams, ...pageInfo });
        fullSampleLabelsMutation.mutate();
    }, []);
    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{ padding: '20px' }}
        >
            <FilterFields
                data={filterParams}
                configs={[{ key: 'name', label: '标签名称' }]}
                onChange={(key, value) => updateState({ filterParams: Object.assign(filterParams, { [key]: value }) })}
                reset={() => {
                    updateState({ filterParams: {}, pageInfo: { ...pageInfo, offset: 0 } });
                    listSampleLabelsMutation.mutate({ ...pageInfo, offset: 0 });
                }}
                search={() => {
                    updateState({ pageInfo: { ...pageInfo, offset: 0 } });
                    listSampleLabelsMutation.mutate({ ...filterParams, ...pageInfo, offset: 0 });
                }}
            />
            <Stack direction="row-reverse" spacing={2}>
                <Button variant="contained" onClick={() => updateState({ createDialogOpen: true })}>创建标签</Button>
                <Button
                    variant="contained"
                    color='error'
                    disabled={selectKeys.length === 0}
                    onClick={() => {
                        confirm.confirm({
                            title: '删除',
                            content: `删除后不可恢复，是否删除群组`,
                        })
                    }}
                >删除标签</Button>
            </Stack>
            <ListTable<SampleLabel>
                data={labels}
                pageInfo={pageInfo}
                checkable
                rowKey="id"
                selectedKeys={selectKeys}
                onSelectRows={(selectKeys) => updateState({ selectKeys })}
                onChange={(params) => {
                    const { offset, limit } = params;
                    updateState({ pageInfo: { ...pageInfo, offset, limit } });
                    listSampleLabelsMutation.mutate({ ...filterParams, offset, limit });
                }}
                headers={[
                    { id: 'name', label: '标签名称', type: 'string' },
                    {
                        id: 'id', label: '操作', render: (value, record) => (
                            <Stack spacing={1} direction="row">
                                <Link onClick={() => updateState({ curEditRecord: record })}>编辑</Link>
                                <Link onClick={() => confirm.confirm({
                                    title: '删除',
                                    content: '删除后不可恢复，是否继续？',
                                    confirmCallback: () => {
                                        deleteSampleLabelMutation.mutate(value);
                                        fullSampleLabelsMutation.mutate();
                                    }
                                })}>删除</Link>
                            </Stack>
                        )
                    }
                ]}
            />
            <CreateLabelDialog
                open={createDialogOpen}
                close={() => updateState({ createDialogOpen: false })}
                labels={allLabels}
                submit={createSampleLabelMutation.mutate}
            />
            <CreateLabelDialog
                open={!!curEditRecord}
                close={() => updateState({ curEditRecord: null })}
                labels={allLabels}
                record={curEditRecord}
                submit={updateSampleLabelMutation.mutate}
            />
        </Stack>
    )
}

export default React.memo(Label);