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

export type MenuItem = {
    key: string
    text: string;
    icon: any;
    path: string;
    element: React.ReactNode;
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'home',
        path: '/home',
        text: '首页',
        icon: <HomeIcon />,
        element: <div>11111</div>,
    },
    {
        key: 'sample',
        path: '/sample/*',
        text: '样片管理',
        icon: <ProductionQuantityLimitsIcon />,
        element: <Sample />
    },
    {
        key: 'appoint',
        path: '/appoint/*',
        text: '预约管理',
        icon: <CalendarMonthIcon />,
        element: <Appoint />
    }
]

const LeftBar = () => {
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
                <ListItemText>{menuItem.text}</ListItemText>
            </ListItemButton>
        )
    })

    return (
        <List>
            {menu}
        </List>
    )
}

export default LeftBar;