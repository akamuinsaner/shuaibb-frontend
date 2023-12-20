import React from 'react';
import Paper from '@mui/material/Paper';
import styles from './index.module.scss';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab';
import { PayStatus, Schedule } from 'declare/schedule';
import { HistoryFields } from 'declare/common';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import StepContent from '@mui/material/StepContent';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import dayjs from 'dayjs';

const OrderHistory = ({
    history
}: {
    history: (Schedule & HistoryFields)[]
}) => {
    const [tabIndex, setTabIndex] = React.useState<number>(0)

    const renderStatus = React.useCallback(() => {
        const steps: any = history.reduce((prev, cur, index) => {
            if (!prev.length) {
                return [
                    ...prev,
                    `${cur.historyUser.showName}创建了订单，等待客户支付 - ${dayjs(cur.historyDate).format('YYYY-MM-DD HH:mm:ss')}`
                ]
            } else if (cur.payStatus === PayStatus['已付定金'] || cur.payStatus === PayStatus['已付全款']) {
                return [
                    ...prev,
                    `${cur.historyUser.showName}修改了订单，顾客已从线下支付，等待拍摄 - ${dayjs(cur.historyDate).format('YYYY-MM-DD HH:mm:ss')}`
                ]
            } else if (cur.payStatus === PayStatus['完成拍摄']) {
                return [
                    ...prev,
                    `${cur.historyUser.showName}修改了订单，拍摄已完成，等待上传原片 - ${dayjs(cur.historyDate).format('YYYY-MM-DD HH:mm:ss')}`
                ]
            } else if (cur.payStatus === PayStatus['完成订单']) {
                return [
                    ...prev,
                    `${cur.historyUser.showName}修改了订单，订单已完成，等待客户评价 - ${dayjs(cur.historyDate).format('YYYY-MM-DD HH:mm:ss')}`
                ]
            } else if (cur.payStatus === PayStatus['已关闭']) {
                return [
                    ...prev,
                    `${cur.historyUser.showName}关闭了订单- ${dayjs(cur.historyDate).format('YYYY-MM-DD HH:mm:ss')}`
                ]
            } else if (history[index - 1].payStatus === PayStatus['已关闭'] && cur.payStatus === PayStatus['未付款']) {
                return [
                    ...prev,
                    `${cur.historyUser.showName}恢复了订单，等待客户支付 - ${dayjs(cur.historyDate).format('YYYY-MM-DD HH:mm:ss')}`
                ]
            }
            return prev
        }, [])
        return (
            <Stepper activeStep={100} orientation="vertical">
                {steps.map(step => (
                    <Step key={step}>
                        <StepLabel StepIconComponent={DataUsageIcon} StepIconProps={{
                            color: 'success'
                        }} optional={""}>{step}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        )
    }, [history]);
    const renderTradeRecords = React.useCallback(() => {
        const steps: any = history.reduce((prev, cur, index) => {
            if (cur.payStatus === PayStatus['已付定金'] || cur.payStatus === PayStatus['已付全款']) {
                return [
                    ...prev,
                    `顾客已从线下支付，等待拍摄 - ${dayjs(cur.historyDate).format('YYYY-MM-DD HH:mm:ss')}`
                ]
            }
            return prev
        }, [])
        return (
            <Stepper activeStep={100} orientation="vertical">
                {steps.map(step => (
                    <Step key={step}>
                        <StepLabel StepIconComponent={DataUsageIcon} StepIconProps={{
                            color: 'success'
                        }} optional={""}>{step}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        )
    }, [history]);
    return (
        <Paper className={styles.orderHistory}>
            <Box className={styles.header}>
                <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
                    <Tab label="订单状态" />
                    <Tab label="交易记录" />
                    <Tab label="下载记录" />
                </Tabs>
            </Box>
            <Box className={styles.body}>
                {tabIndex === 0 ? renderStatus() : null}
                {tabIndex === 1 ? renderTradeRecords() : null}
            </Box>
        </Paper>
    )
}

export default React.memo(OrderHistory);
