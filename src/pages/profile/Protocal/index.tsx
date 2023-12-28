import React from 'react';
import Stack from '@mui/material/Stack';
import styles from './index.module.scss';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const Protocal = () => {
    return (
        <Stack
            direction="column"
            spacing={2}
            className={styles.page}
        >
            <Paper sx={{ padding: '40px' }}>
                <Stack direction="row" alignItems="flex-end">
                    <Typography variant='h5'>服务协议</Typography>
                </Stack>
            </Paper>
        </Stack>
    )
}

export default React.memo(Protocal);
