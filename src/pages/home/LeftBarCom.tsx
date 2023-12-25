import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Sample from '../sample';
import Appoint from 'pages/appoint';
import { useNavigate, useLocation } from 'react-router';
import PersonIcon from '@mui/icons-material/Person';
import Auth from '../auth';
import { withTranslation } from 'react-i18next';

export type MenuItem = {
    key: string
    text: string;
    langKey: string;
    icon: any;
    path: string;
    element: React.ReactNode;
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'home',
        langKey: 'home',
        path: '/home',
        text: '首页',
        icon: <HomeIcon />,
        element: <div>11111</div>,
    },
    {
        key: 'sample',
        path: '/sample/*',
        langKey: 'sample manage',
        text: '样片管理',
        icon: <ProductionQuantityLimitsIcon />,
        element: <Sample />
    },
    {
        key: 'appointment',
        path: '/appointment/*',
        langKey: 'appointment manage',
        text: '预约管理',
        icon: <CalendarMonthIcon />,
        element: <Appoint />
    },
    {
        key: 'auth',
        path: '/auth/*',
        langKey: 'perms manage',
        text: '用户管理',
        icon: <PersonIcon />,
        element: <Auth />
    }
]

const LeftBar = ({ t }: { t: any }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const menu = MENUCONFIG.map((menuItem: MenuItem) => {
        return (
            <ListItemButton
                key={menuItem.key}
                selected={location.pathname.includes(`/${menuItem.key}`)}
                onClick={() => navigate(`/${menuItem.key}`)}
            >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText>{t(menuItem.langKey)}</ListItemText>
            </ListItemButton>
        )
    })

    return (
        <List>
            {menu}
        </List>
    )
}

export default withTranslation()(LeftBar);