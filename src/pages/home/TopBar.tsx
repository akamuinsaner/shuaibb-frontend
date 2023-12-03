import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styles from './index.module.scss';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import useGlobalStore from 'globalStore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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

const LANGCONFIG = {
    ch: '中文',
    en: 'English'
}

const TopBar = () => {
    const user = useGlobalStore(state => state.user)
    const curLang = useGlobalStore(state => state.curLang)
    const updateState = useGlobalStore(state => state.updateState)
    const [langBtnAnchor, setLangBtnAnchor] = React.useState<null | HTMLElement>(null);
    const langMenuOpen = !!langBtnAnchor;
    const langBtnClick = (event: React.MouseEvent<HTMLElement>) => setLangBtnAnchor(event.currentTarget);
    const langBtnMenuClose = () => setLangBtnAnchor(null);
    const btnList = BTNCONFIG.map((btn: Btn) => <Button key={btn.key} sx={{ color: '#fff' }}>{btn.text}</Button>)
    return (
        <AppBar className={styles.appBar} position='static'>
            <Box className={styles.btnList}>
                {btnList}
            </Box>
            <Box>
                <Button
                    onClick={langBtnClick}
                    sx={{ color: '#fff' }}
                >
                    {LANGCONFIG[curLang]}
                </Button>
                <Menu
                    anchorEl={langBtnAnchor}
                    open={langMenuOpen}
                    onClose={langBtnMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {Object.entries(LANGCONFIG).map(([lang, name])=>
                        <MenuItem key={lang} onClick={() => {
                            updateState({ curLang: lang as any })
                            langBtnMenuClose();
                        }}>{name}</MenuItem>)}
                </Menu>
            </Box>
            <Box>
                <Tooltip title="">
                    <IconButton>
                        <Box className={styles.userArea}>
                            <Avatar alt="user avatar" src="/static/images/avatar/2.jpg" />
                            <Button sx={{ color: '#fff' }}>
                                {user?.username || user?.mobile}
                            </Button>
                        </Box>
                    </IconButton>
                </Tooltip>
            </Box>
        </AppBar>
    )
}

export default TopBar;