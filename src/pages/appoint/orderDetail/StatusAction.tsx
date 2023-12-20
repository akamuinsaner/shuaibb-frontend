import React from 'react';
import Paper from '@mui/material/Paper';
import styles from './index.module.scss';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { PayStatus } from 'declare/schedule';
import CloseIcon from '@mui/icons-material/Close';
import MoreIcon from '@mui/icons-material/More';
import { confirm } from 'components/confirmDialog';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StatusAction = ({
    status,
    updateStatus,
    deleteSchedule,
    openEditDialog
}: {
    status: PayStatus;
    updateStatus: (status: PayStatus) => void;
    deleteSchedule: () => void;
    openEditDialog: () => void;
}) => {
    const [editStatusAnchor, setEditStatusAnchor] = React.useState<HTMLElement>(null);
    const [moreSettingAnchor, setMoreSettingAnchor] = React.useState<HTMLElement>(null);
    return (
        <Paper className={styles.statusAction}>
            <Box></Box>
            {status === PayStatus["已关闭"] ? (
                <>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        onClick={() => confirm.confirm({
                            title: '提示',
                            content: '删除后不可恢复，是否确认',
                            confirmCallback: deleteSchedule
                        })}
                    >删除订单</Button>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        color='secondary'
                        onClick={() => confirm.confirm({
                            title: '提示',
                            content: '恢复订单将回到未付款状态，请和客户协商后恢复',
                            confirmCallback: () => updateStatus(PayStatus['未付款'])
                        })}
                    >恢复订单</Button>
                </>
            ) : null}
            {status === PayStatus["未付款"] ? (
                <>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        onClick={() => confirm.confirm({
                            title: '提示',
                            content: '您已经从线下收取定金，订单将跳往等待拍摄状态，是否确定',
                            confirmCallback: () => updateStatus(PayStatus['已付定金'])
                        })}
                    >线下已付定金</Button>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        color='secondary'
                        onClick={() => confirm.confirm({
                            title: '提示',
                            content: '您已经从线下收取全款，订单将跳往等待拍摄状态，是否确定',
                            confirmCallback: () => updateStatus(PayStatus['已付全款'])
                        })}
                    >线下已付全款</Button>
                    <Button
                        className={styles.leftBtm}
                        variant='text'
                        startIcon={<CloseIcon />}
                        onClick={() => confirm.confirm({
                            title: '关闭订单',
                            content: '客户还未支付定金，关闭订单后客户将无法操作，您是否关闭订单',
                            confirmCallback: () => updateStatus(PayStatus['已关闭'])
                        })}
                    >关闭订单</Button>
                </>
            ) : null}
            {(status === PayStatus["已付定金"] || status === PayStatus["已付全款"]) ? (
                <>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        onClick={() => confirm.confirm({
                            title: '已完成拍摄',
                            content: '您是否已经完成了客户的拍摄',
                            confirmCallback: () => updateStatus(PayStatus['完成拍摄'])
                        })}
                    >完成拍摄</Button>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        color='secondary'
                    >分享订单</Button>
                    <Button
                        className={styles.leftBtm}
                        variant='text'
                        startIcon={<CloseIcon />}
                        onClick={() => confirm.confirm({
                            title: '关闭订单',
                            content: '客户已付款，如您需要关闭订单，请跟客户协商并退款，您是否关闭订单',
                            confirmCallback: () => updateStatus(PayStatus['已关闭'])
                        })}
                    >关闭订单</Button>
                </>
            ) : null}
            {(status === PayStatus["完成拍摄"]) ? (
                <>
                    <Button
                        className={styles.btn}
                        variant='contained'
                    >上传原片</Button>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        color='secondary'
                    >上传精修片</Button>
                    <Button
                        className={styles.leftBtm}
                        variant='text'
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => confirm.confirm({
                            title: '完成订单',
                            content: '将订单设为已完成后，将直接结束订单，并无法恢复，是否确认',
                            confirmCallback: () => updateStatus(PayStatus['完成订单'])
                        })}
                    >设为已完成</Button>
                </>
            ) : null}
            {(status === PayStatus["完成订单"]) ? (
                <>
                    <Button
                        className={styles.btn}
                        variant='contained'
                    >生成客户影集</Button>
                    <Button
                        className={styles.btn}
                        variant='contained'
                        color='secondary'
                    >印刷相册</Button>
                    <Button
                        className={styles.leftBtm}
                        variant='text'
                        startIcon={<EditNoteIcon />}
                        onClick={(e) => setEditStatusAnchor(e.currentTarget)}
                    >修改状态</Button>
                    <Menu
                        onClose={() => setEditStatusAnchor(null)}
                        anchorEl={editStatusAnchor}
                        open={!!editStatusAnchor}
                    >
                        <MenuItem onClick={() => {
                            setEditStatusAnchor(null);
                            updateStatus(PayStatus["完成拍摄"]);
                        }}>重新选片</MenuItem>
                        <MenuItem onClick={() => {
                            setEditStatusAnchor(null);
                            updateStatus(PayStatus["完成拍摄"]);
                        }}>上传精修片</MenuItem>
                    </Menu>
                </>
            ) : null}
            <Button
                className={styles.rightBtm}
                variant='text'
                startIcon={<MoreIcon />}
                onClick={(e) => setMoreSettingAnchor(e.currentTarget)}
            >更多设置</Button>
            <Menu
                open={!!moreSettingAnchor}
                anchorEl={moreSettingAnchor}
                onClick={() => setMoreSettingAnchor(null)}
            >
                <MenuItem onClick={() => {
                    setMoreSettingAnchor(null);
                    openEditDialog();
                }}>编辑订单</MenuItem>
                <MenuItem onClick={() => {
                    setMoreSettingAnchor(null);
                    confirm.confirm({
                        title: '提示',
                        content: '删除后不可恢复，是否确认',
                        confirmCallback: deleteSchedule
                    })
                }}>删除订单</MenuItem>
            </Menu>
            <Box></Box>
        </Paper>
    )
}

export default React.memo(StatusAction);
