import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Schedule, PayStatus, PayStatusColors } from 'declare/schedule';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import styles from './index.module.scss'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { message } from 'components/globalMessage';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router';
const OrderListDialog = ({
    open,
    close,
    date,
    schedules
}: {
    open: boolean,
    close: () => void;
    date: string;
    schedules: Schedule[]
}) => {
    const navigate = useNavigate();
    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            className={styles.openListDialog}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '10px' }}>{date}</Typography>
                <Button
                    variant='text'
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => {
                        navigator.clipboard.writeText(date);
                        message.success('复制成功')
                    }}
                >复制</Button>
            </DialogTitle>
            <DialogContent>
                {schedules.map(sche => {
                    return (
                        <Box className={styles.orderBox}>
                            <Box
                                className={styles.orderBoxHeader}
                            >
                                <Typography>{PayStatus[sche.payStatus]}</Typography>
                                <Button
                                    endIcon={<KeyboardArrowRightIcon htmlColor='#fff' />}
                                    size="small"
                                    sx={{ color: '#fff' }}
                                    onClick={() => navigate(`/appointment/schedule/detail?id=${sche.id}`)}
                                >
                                    详情
                                </Button>
                                
                            </Box>
                            <Stack
                                sx={{ background: PayStatusColors[sche.payStatus] }}
                                spacing={1}
                                direction="column"
                                className={styles.orderBoxList}
                            >
                                <Box className={styles.orderBoxListItem}>
                                    <Typography>{sche.customer.name}/{sche.customer.phone}</Typography>
                                    <Button
                                        variant='text'
                                        size="small"
                                        startIcon={<ContentCopyIcon />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${sche.customer.name}/${sche.customer.phone}`);
                                            message.success('复制成功')
                                        }}
                                    >复制</Button>
                                </Box>
                                <Box className={styles.orderBoxListItem}>
                                    <Typography>{sche.sample.name} (￥{sche.sample.price}) </Typography>
                                </Box>
                                <Box className={styles.orderBoxListItem}>
                                    <Typography>{sche.location || '无'}</Typography>
                                    {
                                        sche.location ? (
                                            <Button
                                                variant='text'
                                                size="small"
                                                startIcon={<ContentCopyIcon />}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(sche.location);
                                                    message.success('复制成功')
                                                }}
                                            >复制</Button>
                                        ) : null
                                    }
                                </Box>
                            </Stack>
                        </Box>
                    )
                })}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={close}>关闭</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(OrderListDialog);

