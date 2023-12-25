import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import styles from './index.module.scss';
import {
    retriveSchedule,
    listHistories,
    updateSchedule,
    deleteSchedule,
} from 'apis/schedule';
import {
    listUsers
} from 'apis/auth/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { strToObj } from 'utils/funcTools';
import StatusAction from './StatusAction';
import StatusProgress from './StatusProgress';
import OrderInfo from './OrderInfo';
import OrderHistory from './OrderHistory';
import { PayStatus } from 'declare/schedule';
import { message } from 'components/globalMessage';
import AddScheduleDialog from '../schedule/AddScheduleDialog';
import { useOrderDetailStore } from './store';
import useGlobalStore from 'globalStore';

const OrderDetail = () => {
    const { user } = useGlobalStore(state => state);
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();
    const {
        updateState,
        editDialogOpen
    } = useOrderDetailStore(state => state);
    const searchParams = strToObj(location.search);
    const scheduleId = searchParams['id'];
    const { data: users = [] } = useQuery({ queryFn: listUsers, queryKey: ['listUsers'] });
    const { data: schedule } = useQuery({
        queryFn: () => retriveSchedule(scheduleId),
        queryKey: ['retriveSchedule']
    });
    const { data: history = [] } = useQuery({
        queryFn: () => listHistories(scheduleId),
        queryKey: ['listHistories']
    })
    const updateScheduleMutation = useMutation({
        mutationFn: updateSchedule,
        onSuccess: (data) => message.success('编辑订单成功', {
            closeCallback: () => {
                queryClient.invalidateQueries({ queryKey: ['retriveSchedule'] });
                queryClient.invalidateQueries({ queryKey: ['listHistories'] })
            }
        })
    })
    const deleteScheduleMutation = useMutation({
        mutationFn: deleteSchedule,
        onSettled: (data, error) => message.success('删除成功', {
            closeCallback: () => navigate(-1)
        })
    })
    if (!schedule) return null
    return (
        <Stack direction="column" spacing={2} className={styles.page}>
            <Breadcrumbs sx={{ marginBottom: '16px' }}>
                <Link
                    sx={{ cursor: 'pointer' }}
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate('/appointment/schedule')}
                >订单日历</Link>
                <Link
                    sx={{ cursor: 'pointer' }}
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate('/appointment/center')}
                >订单中心</Link>
                <Typography color="text.primary">订单详情</Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={2} sx={{ height: '200px' }} >
                <StatusAction
                    status={schedule.payStatus}
                    updateStatus={(status: PayStatus) => updateScheduleMutation.mutate({
                        id: scheduleId,
                        payStatus: status,
                        _change_reason: `${user.showName}将订单状态由${PayStatus[schedule.payStatus]}修改为${PayStatus[status]}`
                    })}
                    deleteSchedule={() => deleteScheduleMutation.mutate(scheduleId)}
                    openEditDialog={() => updateState({ editDialogOpen: schedule.shootDate })}
                />
                <StatusProgress
                    status={schedule.payStatus}
                />
            </Stack>
            <OrderInfo
                data={schedule}
                openEditDialog={() => updateState({ editDialogOpen: schedule.shootDate })}

            />
            <OrderHistory
                history={history}
            />
            <AddScheduleDialog
                record={schedule}
                date={editDialogOpen}
                close={() => updateState({ editDialogOpen: null })}
                customers={[]}
                labels={[]}
                users={users}
                submit={(data) => updateScheduleMutation.mutate({
                    ...data,
                    id: scheduleId,
                    _change_reason: `${user.showName}修改了订单`
                })}
            />
        </Stack>

    )
}

export default React.memo(OrderDetail);