import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styles from './index.module.scss';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

type Btn = {
    key: string;
    text: string;
}

const BTNCONFIG: Btn[] = [
    {
        key: 'public',
        text: '公众号'
    },
    {
        key: 'rule',
        text: '规则'
    },
    {
        key: 'study',
        text: '学习'
    },
    {
        key: 'message',
        text: '消息'
    },
    {
        key: 'service',
        text: '官方客服'
    },
    {
        key: 'feedback',
        text: '反馈'
    },
]

const TopBar = () => {

    const btnList = BTNCONFIG.map((btn: Btn) => {
        return (
            <Button key={btn.key} sx={{ color: '#fff' }}>{btn.text}</Button>
        )
    })

    return (
        <AppBar className={styles.appBar} position='static'>
            <Box className={styles.btnList}>
                {btnList}
            </Box>
            <Box>
                <Tooltip title="">
                    <IconButton>
                        <Box className={styles.userArea}>
                            <Avatar alt="user avatar" src="/static/images/avatar/2.jpg" />
                            <Button sx={{ color: '#fff' }}>{12345678}</Button>
                        </Box>
                        </IconButton>
                </Tooltip>
            </Box>
        </AppBar>
    )
}

export default TopBar;