import React from 'react';
import { Typography } from '@mui/material';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Schedule } from 'declare/schedule';
import { Customer } from 'declare/customer';
import { PayStatusColors } from 'declare/schedule';

const AppointCalendar = ({
    monthState,
    showAddDialog,
    schedules,
    showOrderDialog,
    changeView
}: {
    monthState: { year: number, month: number };
    showAddDialog: (date: string) => void;
    schedules: Schedule[];
    showOrderDialog: (date: string) => void;
    changeView: (date: string) => void;
}) => {
    const getRenderList = React.useCallback(() => {
        const { year, month } = monthState;
        const startDayOfMonth = dayjs(`${year}-${month}`).startOf('month');
        const endDayofMonth = dayjs(`${year}-${month}`).endOf('month');
        const daysOfMonth = endDayofMonth.diff(startDayOfMonth, 'd') + 1;
        const list = Array(daysOfMonth).fill({}).map((item, index) => ({
            beforeMonth: false,
            inMonth: true,
            date: startDayOfMonth.add(index, 'd').format('YYYY-MM-DD')
        }))
        const daysBeforeFirstDay = startDayOfMonth.day() - 0;
        const daysAfterLastDay = 6 - endDayofMonth.day()
        Array(daysBeforeFirstDay).fill({}).map((item, index) => {
            list.unshift({
                beforeMonth: true,
                inMonth: false,
                date: startDayOfMonth.subtract(index + 1, 'd').format('YYYY-MM-DD')
            })
        })
        Array(daysAfterLastDay).fill({}).map((item, index) => {
            list.push({
                beforeMonth: false,
                inMonth: false,
                date: endDayofMonth.add(index + 1, 'd').format('YYYY-MM-DD')
            })
        })
        return list;
    }, [monthState]);
    return (
        <Box className={styles.calendar}>
            <Typography key={1} className={styles.dateHeader}>日</Typography>
            <Typography key={2} className={styles.dateHeader}>一</Typography>
            <Typography key={3} className={styles.dateHeader}>二</Typography>
            <Typography key={4} className={styles.dateHeader}>三</Typography>
            <Typography key={5} className={styles.dateHeader}>四</Typography>
            <Typography key={6} className={styles.dateHeader}>五</Typography>
            <Typography key={7} className={styles.dateHeader}>六</Typography>
            {getRenderList().map((item, index) => {
                const date = dayjs(item.date).date()
                const showDate = date < 10 ? `0${date}` : date;
                const schedulesOfToday = schedules.filter(sch => sch.shootDate === item.date);
                return (
                    <Box
                        key={item.date}
                        className={`
                            ${styles.canlendarItem}
                            ${item.beforeMonth ? styles.beforeMonth : ''}
                            ${dayjs(item.date).isBefore(dayjs()) ? styles.beforeToday : ''}
                            ${dayjs(item.date).isToday() ? styles.isToday : ''}
                            ${schedulesOfToday.length ? styles.hasSchedule : ''}
                        `}
                        onClick={() => changeView(item.date)}
                    >
                        <Typography
                            className={styles.showDate}
                        >{showDate}</Typography>
                        <Box className={styles.scheduleList}>
                            {schedulesOfToday.map(schedule => (
                                <Box
                                    key={schedule.id}
                                    className={styles.scheduleItem}
                                    onClick={() => showOrderDialog(item.date)}
                                >
                                    <div style={{ background: PayStatusColors[schedule.payStatus] }}></div>
                                    <Typography>{schedule.customer?.name}</Typography>
                                </Box>
                            ))}
                        </Box>
                        {
                            schedulesOfToday.length ? (
                                <Button
                                    variant='text'
                                    className={styles.schedulesCount}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showOrderDialog(item.date)
                                    }}
                                >
                                    {schedulesOfToday.length}单
                                </Button>
                            ) : null
                        }
                        <Button
                            variant='text'
                            className={styles.addButton}
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                                e.stopPropagation();
                                showAddDialog(item.date)
                            }}
                        >档期</Button>
                    </Box>
                )
            })}
        </Box>
    )
}

export default React.memo(AppointCalendar);
