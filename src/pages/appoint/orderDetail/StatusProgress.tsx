import React from 'react';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { PayStatus } from 'declare/schedule';
import styles from './index.module.scss';

const LABELSCONFIG = [
    {
        text: '支付订单',
        key: PayStatus['已付定金'],
    }, {
        text: '完成拍摄',
        key: PayStatus['完成拍摄'],
    }, {
        text: '上传底片',
        key: PayStatus['完成订单'],
    }, {
        text: '完成',
        key: PayStatus['完成订单'],
    }
]

const StatusProgress = ({
    status
}: {
    status: PayStatus
}) => {
    return (
        <Paper className={styles.statusProgress}>
            <Stepper sx={{ flex: 1 }} alternativeLabel>
                {LABELSCONFIG.map(label => {
                    return <Step active={status >= label.key} key={label.text}>
                        <StepLabel StepIconProps={{
                            sx: { height: '50px', width: '50px' }
                        }}>{label.text}</StepLabel>
                    </Step>
                })}
            </Stepper>
        </Paper>
    )
}

export default React.memo(StatusProgress);
