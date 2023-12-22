import React from 'react';
import Stack from '@mui/material/Stack';
import styles from './index.module.scss';
import ListTable from 'components/ListTable';
import FilterFields from 'components/FilterFields';
import { listCustomers } from 'apis/customer';
import { listUsers } from 'apis/auth/user';
import { listSample } from 'apis/sample';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useStore } from './store';
import { PayStatus, Schedule } from 'declare/schedule';
import { searchSchedules } from 'apis/schedule';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import Link from '@mui/material/Link';
import { HistoryFields } from 'declare/common';

const AppointmentCenter = () => {
    const {
        errors,
        orderParams,
        list,
        filterParams,
        updateState,
        pageInfo,
        selectedKeys,
    } = useStore(state => state);
    const navigate = useNavigate();
    const { data: customers = [] } = useQuery({
        queryFn: listCustomers,
        queryKey: ["listCustomers"],
    });
    const { data: { data: samples = [] } = {} } = useQuery({
        queryFn: () => listSample({ total: 0, offset: 0, limit: 10000 }),
        queryKey: ["listSample"],
    });
    const { data: users = [] } = useQuery({
        queryFn: listUsers,
        queryKey: ["listUsers"],
    });
    const searchSchedulesMutation = useMutation({
        mutationFn: searchSchedules,
        onSuccess: (res) => {
            const { data, ...pageInfo } = res;
            updateState({ selectedKeys: [], pageInfo, list: data })
        }
    })
    React.useEffect(() => {
        searchSchedulesMutation.mutate({ ...filterParams, ...pageInfo })
    }, [])
    console.log(errors)
    return (
        <Stack className={styles.page} spacing={2}>
            <FilterFields
                errors={errors}
                data={filterParams}
                onChange={(key, value) => {
                    if (key === 'startDate'
                        && filterParams['endDate']
                        && dayjs(value).isAfter(filterParams['endDate'])) {
                        updateState({ errors: { ...errors, startDate: '开始日期不能晚于结束日期' } });
                    } else if (key === 'endDate'
                        && filterParams['startDate']
                        && dayjs(value).isBefore(filterParams['startDate'])) {
                        updateState({ errors: { ...errors, endDate: '结束日期不能早于开始日期' } });
                    } else {
                        updateState({ filterParams: { ...filterParams, [key]: value }, errors: {} })
                    }
                }}
                reset={() => updateState({ filterParams: {}, errors: {} })}
                search={() => {
                    updateState({
                        pageInfo: { ...pageInfo, offset: 0 },
                        selectedKeys: [],
                        orderParams: { order: 'asc', orderBy: null }
                    });
                    searchSchedulesMutation.mutate({
                        ...filterParams,
                        ...pageInfo,
                        offset: 0,
                        order: 'asc',
                        orderBy: null
                    })
                }}
                configs={[
                    {
                        key: 'customerIds', label: '客户', type: 'autoComplete',
                        selectProps: {
                            options: customers, multiple: true, renderField: 'name', valueField: "id",
                            labelField: (o) => `${o.name}(${o.phone})`,
                        },
                    },
                    {
                        key: 'sampleIds', label: '样片', type: 'autoComplete',
                        selectProps: { options: samples, multiple: true, valueField: 'id', labelField: (o) => `${o.name}` }
                    },
                    {
                        key: 'payStatus', label: '状态', type: 'select',
                        selectProps: {
                            options: Object.keys(PayStatus).filter(k => isNaN(Number(k))).map((name) => ({ name, id: PayStatus[name] })),
                            multiple: true, valueField: 'id', labelField: 'name'
                        }
                    },
                    {
                        key: 'executorIds', label: '执行者', type: 'autoComplete',
                        selectProps: {
                            options: users, multiple: true, renderField: 'showName', valueField: 'id',
                            labelField: (o) => `${o.showName}(${o.mobile})`,
                        }
                    },
                    { key: 'startDate', label: "拍摄开始日期", type: 'date', },
                    { key: 'endDate', label: "拍摄结束日期", type: 'date', }
                ]}
            />
            <ListTable<Schedule>
                orderParams={orderParams}
                // checkable
                // selectedKeys={selectedKeys}
                expandable
                expandContent={(record: Schedule) => {
                    return <ListTable<Schedule & HistoryFields>
                        headers={[
                            { id: 'historyId', label: '变更id', type: 'string' },
                            { id: 'historyUser', label: '变更人', type: 'string', render: (v) => v.showName },
                            { id: 'historyDate', label: '变更时间', type: 'string',
                                render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss') },
                            { id: 'historyChangeReason', label: '变更原因', type: 'string' },
                        ]}
                        data={record.history}
                        showPaganition={false}
                    />
                }}
                headers={[
                    { id: 'customer', label: '客户', type: 'string', render: (v) => `${v.name}(${v.phone})` },
                    { id: 'sample', label: '样片', type: 'string', render: (v) => v.name },
                    { id: 'price', label: '价格', type: 'number' },
                    { id: 'deposit', label: '定金', type: 'number' },
                    { id: 'payStatus', label: '状态', type: 'string', render: (v) => PayStatus[v] },
                    { id: 'shootDate', label: '拍摄日期', type: 'date' },
                    { id: 'startTime', label: '拍摄时间', type: 'string', render: (v) => dayjs(v, 'hh:mm:a').format('hh:mm') },
                    { id: 'executors', label: '执行者', type: 'string', render: (v) => v.map(e => e.showName).join(', ') },
                    { id: 'id', label: '操作', render: (value) => (
                        <Stack spacing={1} direction="row">
                            <Link onClick={() => navigate(`/appointment/detail?id=${value}`)}>查看</Link>
                        </Stack>
                    ) }
                ]}
                data={list}
                pageInfo={pageInfo}
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
                    searchSchedulesMutation.mutate({
                        ...params,
                        ...filterParams,
                    })
                }}
            />
        </Stack>
    )
}

export default React.memo(AppointmentCenter);