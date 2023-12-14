import React from 'react';
import styles from './index.module.scss';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Schedule, PayStatusColors, PayStatus } from 'declare/schedule';
import AddIcon from '@mui/icons-material/Add';

const RightBar = ({
    date,
    schedules,
    showAddDialog
}: {
    date: string;
    schedules: Schedule[];
    showAddDialog: () => void;
}) => {
    return (
        <Stack className={styles.right} spacing={2} direction="column">
            <Typography>{dayjs(date).format('YYYY年MM月')}</Typography>
            <Box className={styles.date}>{dayjs(date).format('DD')}</Box>
            <Divider className={styles.divider} />
            <Typography>今日有{schedules.length}个订单</Typography>
            <>
                {schedules.map(sche => {
                    return (
                        <Stack key={sche.id} className={styles.scheduleItem} spacing={2} direction="column">
                            <Box
                                className={styles.avatar}
                                sx={{ background: PayStatusColors[sche.payStatus] }}
                            >{sche.customer.name.charAt(0)}</Box>
                            <Typography>{sche.customer.name}</Typography>
                            <Box
                                className={styles.status}
                                sx={{ background: PayStatusColors[sche.payStatus] }}
                            >{PayStatus[sche.payStatus]}</Box>
                        </Stack>
                    )
                })}
            </>
            <Divider className={styles.divider} />
            <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={showAddDialog}
            >
                添加档期
            </Button>
        </Stack>
    )
}

export default React.memo(RightBar);
