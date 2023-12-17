import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { useScheduleStore } from './store';
import styles from './index.module.scss';
import ScheduleHeader from './ScheduleHeader';
import ScheduleCalendar from './ScheduleCalendar';
import AddScheduleDialog from './AddScheduleDialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { sampleLabels } from 'apis/sample';
import { listSchedules, createSchedule } from 'apis/schedule';
import { message } from 'components/globalMessage';
import { listCustomers } from 'apis/customer';
import OrderListDialog from './OrderListDialog';
import RightBar from './RightBar';

dayjs.extend(isToday)

const Schedule = () => {
    const {
        curViewDate,
        orderDialogOpen,
        curOrderDate,
        schedules,
        curAddDate,
        monthState,
        updateState
    } = useScheduleStore(state => state);
    const { data: labels } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const { data: customers } = useQuery({ queryFn: listCustomers, queryKey: ['listCustomers', { keyword: '' }] })
    const listScheduleMutation = useMutation({
        mutationFn: listSchedules,
        onSuccess: (data) => updateState({ schedules: data })
    })
    const createScheduleMutation = useMutation({
        mutationFn: createSchedule,
        onSuccess: (data) => message.success('创建成功', {
            closeCallback: () => updateState({ monthState: {...monthState} })
        })
    })
    React.useEffect(() => {
        const { year, month } = monthState;
        const startDayOfMonth = dayjs(`${year}-${month}`).startOf('month').format('YYYY-MM-DD');
        const endDayofMonth = dayjs(`${year}-${month}`).endOf('month').format('YYYY-MM-DD');
        listScheduleMutation.mutate({ startDate: startDayOfMonth, endDate: endDayofMonth })
    }, [monthState])
    return (
        <Paper className={styles.schedulePage}>
            <Box className={styles.left}>
                <ScheduleHeader
                    monthState={monthState}
                    updateMonthState={(state) => updateState({ monthState: state })}
                />
                <ScheduleCalendar
                    monthState={monthState}
                    showAddDialog={(date: string) => updateState({ curAddDate: date })}
                    schedules={schedules}
                    showOrderDialog={(date: string) => updateState({ orderDialogOpen: true, curOrderDate: date })}
                    changeView={(date: string) => updateState({ curViewDate: date })}
                />
            </Box>
            <RightBar
                date={curViewDate}
                schedules={schedules.filter(item => item.shootDate === curViewDate)}
                showAddDialog={() => updateState({ curAddDate: curViewDate })}
            />
            <AddScheduleDialog
                date={curAddDate}
                close={() => updateState({ curAddDate: '' })}
                labels={labels}
                submit={createScheduleMutation.mutate}
                customers={customers}
            />
            <OrderListDialog
                open={orderDialogOpen}
                close={() => updateState({ orderDialogOpen: false })}
                date={curOrderDate}
                schedules={schedules.filter(item => item.shootDate === curOrderDate)}
            />
        </Paper>
    )
}

export default React.memo(Schedule);