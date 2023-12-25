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
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';

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
    ch: 'CH',
    en: 'EN'
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const TopBar = () => {
    const user = useGlobalStore(state => state.user)
    const curLang = useGlobalStore(state => state.curLang)
    const darkMode = useGlobalStore(state => state.darkMode)
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
                    {Object.entries(LANGCONFIG).map(([lang, name]) =>
                        <MenuItem key={lang} onClick={() => {
                            updateState({ curLang: lang as any })
                            langBtnMenuClose();
                        }}>{name}</MenuItem>)}
                </Menu>
                <MaterialUISwitch
                    sx={{ m: 1 }}
                    checked={darkMode}
                    onChange={(e) => (updateState({ darkMode: e.target.checked }))}
                />
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